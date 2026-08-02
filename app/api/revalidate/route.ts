import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * On-demand revalidation endpoint.
 * WordPress pings this whenever a post/page is saved, and the frontend
 * refreshes the affected content within seconds — no full redeploy.
 *
 * Security: the caller must present the shared secret. Without it the route
 * refuses, so no one can hammer your cache.
 *
 * Call examples (from the WP snippet):
 *   POST /api/revalidate?secret=XXX            -> refreshes all WP content
 *   POST /api/revalidate?secret=XXX&slug=abc&type=post
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: "Server missing REVALIDATE_SECRET" },
      { status: 500 }
    );
  }
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 }
    );
  }

  const slug = req.nextUrl.searchParams.get("slug");
  const type = req.nextUrl.searchParams.get("type"); // "post" | "page"

  try {
    // Refresh the tagged data caches used by lib/wp.ts.
    revalidateTag("wp-posts");
    revalidateTag("wp-pages");

    // Also refresh specific rendered routes when we know them.
    revalidatePath("/"); // homepage news grid
    if (slug && type === "post") revalidatePath(`/posts/${slug}`);
    if (slug && type === "page") revalidatePath(`/${slug}`);

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      slug: slug ?? null,
      type: type ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { revalidated: false, message },
      { status: 500 }
    );
  }
}

// Allow a plain GET for a quick manual test in the browser.
export async function GET(req: NextRequest) {
  return POST(req);
}
