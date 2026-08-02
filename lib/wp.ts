import type { WPPost, WPPage, ArticleView, WPBase } from "./types";

const API_BASE =
  process.env.WP_API_BASE?.replace(/\/$/, "") ||
  "https://themico.websage.lat/wp-json/wp/v2";

// Fallback interval. Content refreshes on-demand via the /api/revalidate
// webhook (see app/api/revalidate/route.ts); this long interval is just a
// safety net in case a webhook is ever missed.
const REVALIDATE_SECONDS = 86400; // 24h

interface FetchResult<T> {
  data: T;
  ok: boolean;
  error?: string;
}

/**
 * Wrapper around fetch that never throws: on any failure it resolves to
 * { ok: false, data: <fallback>, error }. Keeps the static build from
 * crashing when the WP backend is unreachable at build time.
 *
 * `tags` attach this request to a cache tag so the webhook can invalidate it
 * on demand (e.g. "wp-posts", "wp-pages").
 */
async function safeFetch<T>(
  path: string,
  fallback: T,
  tags: string[] = []
): Promise<FetchResult<T>> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        // Cloudflare (in front of WordPress) blocks requests with a blank/default
        // User-Agent as suspected bots. A real UA makes server-side fetches pass.
        "User-Agent": "MicoFrontend/1.0 (+https://astro.websage.lat)",
      },
      next: { revalidate: REVALIDATE_SECONDS, tags },
    });

    if (!res.ok) {
      return {
        data: fallback,
        ok: false,
        error: `WP responded ${res.status} ${res.statusText} for ${path}`,
      };
    }

    const json = (await res.json()) as T;
    return { data: json, ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Log server-side; the caller decides how to surface it to the UI.
    console.error(`[wp] fetch failed: ${url} — ${message}`);
    return { data: fallback, ok: false, error: message };
  }
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&nbsp;/g, " ")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]+>/g, "")
    .trim();
}

/** Convert a raw WP entity into the flat view model the layouts use. */
export function toArticleView(item: WPBase): ArticleView {
  const media = item._embedded?.["wp:featuredmedia"]?.[0];
  const terms = item._embedded?.["wp:term"]?.flat() ?? [];
  const category =
    terms.find((t) => t.taxonomy === "category")?.name || "Mico University";

  return {
    id: item.id,
    slug: item.slug,
    title: decodeEntities(item.title?.rendered ?? "Untitled"),
    html: item.content?.rendered ?? "",
    excerpt: decodeEntities(item.excerpt?.rendered ?? ""),
    date: item.date,
    category,
    featuredImage: media?.source_url ?? null,
    featuredAlt: media?.alt_text || "",
  };
}

/* ----------------------------- Posts ----------------------------- */

export async function getAllPosts(): Promise<ArticleView[]> {
  const { data } = await safeFetch<WPPost[]>(
    "/posts?per_page=100&_embed=wp:featuredmedia,wp:term&status=publish",
    [],
    ["wp-posts"]
  );
  return data.map(toArticleView);
}

export async function getPostSlugs(): Promise<string[]> {
  const { data } = await safeFetch<WPPost[]>(
    "/posts?per_page=100&_fields=slug&status=publish",
    [],
    ["wp-posts"]
  );
  return data.map((p) => p.slug);
}

export async function getPostBySlug(
  slug: string
): Promise<ArticleView | null> {
  const { data, ok } = await safeFetch<WPPost[]>(
    `/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term`,
    [],
    ["wp-posts"]
  );
  if (!ok || data.length === 0) return null;
  return toArticleView(data[0]);
}

/* ----------------------------- Pages ----------------------------- */

export async function getAllPages(): Promise<ArticleView[]> {
  const { data } = await safeFetch<WPPage[]>(
    "/pages?per_page=100&_embed=wp:featuredmedia,wp:term&status=publish",
    [],
    ["wp-pages"]
  );
  return data.map(toArticleView);
}

export async function getPageSlugs(): Promise<string[]> {
  const { data } = await safeFetch<WPPage[]>(
    "/pages?per_page=100&_fields=slug&status=publish",
    [],
    ["wp-pages"]
  );
  return data.map((p) => p.slug);
}

export async function getPageBySlug(
  slug: string
): Promise<ArticleView | null> {
  const { data, ok } = await safeFetch<WPPage[]>(
    `/pages?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term`,
    [],
    ["wp-pages"]
  );
  if (!ok || data.length === 0) return null;
  return toArticleView(data[0]);
}

/* ------------------------------ ACF fields ------------------------------ */

/**
 * Fetch a page's ACF fields by page ID. ACF 6.x exposes fields natively under
 * an `acf` key on the page object. Returns {} on any failure, so callers can
 * safely fall back to their built-in defaults.
 */
export async function getPageAcf(
  pageId: number
): Promise<Record<string, unknown>> {
  const { data, ok } = await safeFetch<{ acf?: Record<string, unknown> }>(
    `/pages/${pageId}?_fields=acf`,
    {},
    ["wp-pages", `wp-page-${pageId}`]
  );
  if (!ok || !data || typeof data.acf !== "object" || data.acf === null) {
    return {};
  }
  return data.acf;
}

/**
 * Helper: return the ACF value if it's a non-empty string, else the fallback.
 * Keeps the site showing built-in defaults until an editor fills a field.
 */
export function acfText(
  acf: Record<string, unknown>,
  key: string,
  fallback: string
): string {
  const v = acf[key];
  return typeof v === "string" && v.trim() !== "" ? v : fallback;
}

/**
 * Return an ACF image URL if set, else null. ACF image fields set to "url"
 * return format give a string; if configured as an object/array, we dig out
 * the url. Null lets callers fall back to a bundled image or placeholder.
 */
export function acfImage(
  acf: Record<string, unknown>,
  key: string
): string | null {
  const v = acf[key];
  if (typeof v === "string" && v.trim() !== "") return v;
  if (v && typeof v === "object") {
    const obj = v as Record<string, unknown>;
    if (typeof obj.url === "string" && obj.url.trim() !== "") return obj.url;
  }
  return null;
}

export { API_BASE, REVALIDATE_SECONDS };
