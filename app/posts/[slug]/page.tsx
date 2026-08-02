import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import PageHero from "../../../components/PageHero";
import WPContent from "../../../components/WPContent";
import { getPostSlugs, getPostBySlug } from "../../../lib/wp";

export const revalidate = 3600;
// Any slug not generated at build time is rendered on-demand, then cached.
export const dynamicParams = true;

// Statically generate a route for every published post at build time.
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Not found — Mico University" };
  return {
    title: `${post.title} — Mico University`,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const dateLabel = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1a1a1a" }}>
      <SiteHeader />

      <PageHero
        title={post.title}
        crumb="News"
        image={post.featuredImage}
        height={360}
      />

      <article
        style={{
          padding: "64px 40px 96px",
          maxWidth: "820px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "12px",
          }}
        >
          {post.category} · {dateLabel}
        </div>
        <WPContent html={post.html} />
      </article>

      <SiteFooter />
    </div>
  );
}
