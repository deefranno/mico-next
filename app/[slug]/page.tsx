import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import PageHero from "../../components/PageHero";
import WPContent from "../../components/WPContent";
import { getPageSlugs, getPageBySlug } from "../../lib/wp";

export const revalidate = 3600;
export const dynamicParams = true;

// Slugs that have their own bespoke, hand-built routes — never handled here.
const RESERVED = new Set(["admissions", "contact", "posts"]);

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.filter((slug) => !RESERVED.has(slug)).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if (RESERVED.has(params.slug)) return {};
  const page = await getPageBySlug(params.slug);
  if (!page) return { title: "Not found — Mico University" };
  return {
    title: `${page.title} — Mico University`,
    description: page.excerpt,
  };
}

export default async function GenericPage({
  params,
}: {
  params: { slug: string };
}) {
  if (RESERVED.has(params.slug)) notFound();

  const page = await getPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1a1a1a" }}>
      <SiteHeader />

      <PageHero
        title={page.title}
        crumb={page.title}
        image={page.featuredImage}
        height={320}
      />

      <div
        style={{
          padding: "64px 40px 96px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <WPContent html={page.html} />
      </div>

      <SiteFooter />
    </div>
  );
}
