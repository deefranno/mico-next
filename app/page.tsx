import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { getAllPosts, getPageAcf, acfText, acfImage, REVALIDATE_SECONDS } from "../lib/wp";
import type { ArticleView } from "../lib/types";

// Statically generated; refreshed on-demand via the revalidate webhook,
// with a periodic safety-net rebuild.
export const revalidate = 3600;

// Fallback news identical to the original design's inline newsItems.
const FALLBACK_NEWS = [
  {
    category: "Health Sciences",
    title: "Study links sleep patterns to student focus",
    blurb:
      "Researchers find measurable changes in attention and memory after disrupted sleep cycles.",
    slug: "#",
    image: null as string | null,
  },
  {
    category: "Campus & Community",
    title: "Mico ranks among top regional universities for impact",
    blurb:
      "Mico earns national recognition for community engagement and student outcomes.",
    slug: "#",
    image: null,
  },
  {
    category: "Campus & Community",
    title: "Why staying in clubs helps students thrive",
    blurb:
      "A student-led study finds structured activity linked to stronger academic performance.",
    slug: "#",
    image: null,
  },
  {
    category: "Athletics",
    title: "Mico athletics program expands to new conference",
    blurb:
      "Student-athletes gain new competitive opportunities starting next season.",
    slug: "#",
    image: null,
  },
];

const heroOverlay =
  "linear-gradient(180deg, rgba(0,0,0,0.495) 0%, rgba(0,0,0,0.3025) 55%, rgba(0,0,0,0.4125) 100%)";

export default async function HomePage() {
  const posts = await getAllPosts();
  const acf = await getPageAcf(25); // Home page in WordPress

  // Prefer live WP posts for the Latest News grid; fall back to the
  // original static items when the backend returns nothing.
  const news =
    posts.length > 0
      ? posts.slice(0, 4).map((p: ArticleView) => ({
          category: p.category,
          title: p.title,
          blurb: p.excerpt || "",
          slug: `/posts/${p.slug}`,
          image: p.featuredImage,
        }))
      : FALLBACK_NEWS;

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        color: "#1a1a1a",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <SiteHeader active="about" />

      {/* Hero */}
      <div style={{ position: "relative", width: "100%", height: "640px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: `url("${
              acfImage(acf, "hero_image") || "/assets/hero-campus.webp"
            }") center / cover no-repeat`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: heroOverlay,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "640px",
            padding: "90px 0 0 40px",
            pointerEvents: "none",
          }}
        >
          <h1
            className="mico-hero-h1"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "56px",
              lineHeight: 1.05,
              color: "#000000",
              margin: "0 0 24px",
            }}
          >
            {acfText(acf, "hero_headline", "Do It With Thy Might")}
          </h1>
          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              color: "#000000",
              margin: "0 0 28px",
            }}
          >
            {acfText(
              acf,
              "hero_body",
              "Founded in 1836, Mico University has spent generations turning curiosity into achievement. From student-led research to athletics and civic leadership, Mico prepares the next wave of doers."
            )}
          </p>
          <Link
            href={acfText(acf, "hero_button_url", "/admissions#apply")}
            style={{
              pointerEvents: "auto",
              display: "inline-block",
              background: "#F2A900",
              color: "#111",
              fontWeight: 700,
              fontSize: "16px",
              padding: "14px 28px",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            {acfText(acf, "hero_button_label", "Start your application")}
          </Link>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "40px",
            background: "#fff",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          ⏸
        </div>
      </div>

      {/* Section: Curiosity */}
      <div
        className="mico-grid-2"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          gap: "64px",
          alignItems: "center",
          padding: "96px 40px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "34px",
              color: "#111",
              margin: "0 0 20px",
            }}
          >
            {acfText(acf, "curiosity_heading", "Turn your Curiosity into Discovery")}
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#3a3a3a",
              margin: "0 0 16px",
            }}
          >
            With more than{" "}
            <a href="#" style={{ fontWeight: 600 }}>
              180 degree programs
            </a>{" "}
            across 10 colleges, Mico offers a path for every ambition — a
            research lab, a courtroom, a clinic, a stage or a startup.
          </p>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#3a3a3a",
              margin: "0 0 28px",
            }}
          >
            {acfText(
              acf,
              "curiosity_body2",
              "At Mico, learning goes beyond the classroom. Work alongside faculty researchers, gain hands-on field experience and contribute to discoveries shaping health, technology and community."
            )}
          </p>
        </div>
        <div
          style={{
            width: "100%",
            height: "480px",
            borderRadius: "4px",
            background: acfImage(acf, "curiosity_image")
              ? `url("${acfImage(acf, "curiosity_image")}") center / cover no-repeat`
              : "linear-gradient(135deg, #e8e6e1 0%, #d4d0c8 100%)",
          }}
        />
      </div>

      {/* Section: Waiting for you */}
      <div style={{ background: "#F5F4F1", padding: "96px 40px" }}>
        <div
          className="mico-grid-2"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            gap: "64px",
            alignItems: "center",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "34px",
                color: "#111",
                margin: "0 0 20px",
              }}
            >
              {acfText(acf, "waiting_heading", "Discover What's Waiting for You")}
            </h2>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#3a3a3a",
                margin: "0 0 24px",
              }}
            >
              {acfText(
                acf,
                "waiting_body",
                "From the moment you step on campus, Mico feels like home. You'll challenge yourself, find support from a community that believes in your potential and connect with people who become lifelong friends."
              )}
            </p>
            <a
              href="#"
              style={{
                fontWeight: 600,
                fontSize: "15px",
                display: "block",
                marginBottom: "32px",
              }}
            >
              Explore Student Life
            </a>
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                color: "#111",
                margin: "0 0 16px",
              }}
            >
              Campus by the Numbers
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              {[
                {
                  n: acfText(acf, "stat1_number", "14"),
                  t: acfText(acf, "stat1_label", "NCAA Division I Sports"),
                  border: true,
                },
                {
                  n: acfText(acf, "stat2_number", "220+"),
                  t: acfText(
                    acf,
                    "stat2_label",
                    "Clubs, academic associations and professional organizations"
                  ),
                  border: true,
                },
                {
                  n: acfText(acf, "stat3_number", "190K+"),
                  t: acfText(acf, "stat3_label", "Alumni network"),
                  border: false,
                },
              ].map((row) => (
                <div
                  key={row.n}
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "baseline",
                    borderBottom: row.border ? "1px solid #ddd" : undefined,
                    paddingBottom: row.border ? "16px" : undefined,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                      fontSize: "24px",
                      color: "#111",
                      width: "90px",
                    }}
                  >
                    {row.n}
                  </span>
                  <span style={{ fontSize: "15px", color: "#3a3a3a" }}>
                    {row.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "480px",
              borderRadius: "4px",
              background: acfImage(acf, "waiting_image")
                ? `url("${acfImage(acf, "waiting_image")}") center / cover no-repeat`
                : "linear-gradient(135deg, #e8e6e1 0%, #d4d0c8 100%)",
            }}
          />
        </div>
      </div>

      {/* Section: Research banner */}
      <div className="mico-research-wrap" style={{ position: "relative", width: "100%", height: "320px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: acfImage(acf, "research_image")
              ? `url("${acfImage(acf, "research_image")}") center / cover no-repeat`
              : "linear-gradient(135deg, #2a2a2a 0%, #555 100%)",
          }}
        />
        <div
          className="mico-research-box"
          style={{
            position: "absolute",
            top: "1px",
            left: 0,
            width: "852px",
            maxWidth: "90%",
            height: "319px",
            background: "#F5F4F1",
            padding: "48px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.08em",
              color: "#666",
              marginBottom: "8px",
            }}
          >
            {acfText(acf, "research_kicker", "RESEARCH AT MICO")}
          </span>
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "30px",
              color: "#111",
              margin: "0 0 16px",
            }}
          >
            {acfText(acf, "research_heading", "Where Curiosity Meets Rigor")}
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#3a3a3a",
              margin: "0 0 20px",
            }}
          >
            {acfText(
              acf,
              "research_body",
              "At Mico, research isn't a headline — it's a habit. With growing investment across health, environment and technology, faculty and students are turning ideas into impact."
            )}
          </p>
          <a href="#" style={{ fontWeight: 600, fontSize: "15px" }}>
            See Mico Research
          </a>
        </div>
      </div>

      {/* Latest News (WP-driven) */}
      <div className="mico-pad" style={{ padding: "96px 40px", maxWidth: "1400px", margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "34px",
            color: "#111",
            margin: "0 0 40px",
          }}
        >
          Latest News
        </h2>
        <div
          className="mico-grid-news"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          {news.map((item, i) => {
            const CardInner = (
              <>
                <div
                  className="mico-news-thumb"
                  style={{
                    width: "160px",
                    height: "110px",
                    flexShrink: 0,
                    borderRadius: "4px",
                    background: item.image
                      ? `url("${item.image}") center / cover no-repeat`
                      : "linear-gradient(135deg, #e8e6e1 0%, #d4d0c8 100%)",
                  }}
                />
                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.category}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: "17px",
                      color: "#111",
                      margin: "6px 0 8px",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {item.blurb}
                  </p>
                </div>
              </>
            );

            const cardStyle: React.CSSProperties = {
              border: "1px solid #e4e4e4",
              borderRadius: "4px",
              display: "flex",
              gap: "20px",
              padding: "20px",
              textDecoration: "none",
              color: "inherit",
            };

            return item.slug && item.slug !== "#" ? (
              <Link key={i} href={item.slug} className="mico-news-card" style={cardStyle}>
                {CardInner}
              </Link>
            ) : (
              <div key={i} className="mico-news-card" style={cardStyle}>
                {CardInner}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "right", marginTop: "32px" }}>
          <a href="#" style={{ fontWeight: 600, fontSize: "15px" }}>
            View more news
          </a>
        </div>
      </div>

      {/* CTA banner */}
      <div style={{ position: "relative", width: "100%", minHeight: "480px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `url("${
              acfImage(acf, "cta_image") || "/overhead-ms1ovn97-9ha2.webp"
            }") center / cover no-repeat`,
            pointerEvents: "none",
            opacity: 1,
          }}
        />
        <div
          className="mico-cta-grid mico-pad"
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
            padding: "64px 40px",
            maxWidth: "1400px",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <div>
            <span
              style={{
                color: "#F2A900",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.08em",
              }}
            >
              ARE YOU READY?
            </span>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "40px",
                color: "#FFF000",
                margin: "12px 0 0",
              }}
            >
              {acfText(acf, "cta_heading", "Take the next step with Mico")}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[
              { icon: "🎓", label: "Apply Now", href: "/admissions#apply" },
              { icon: "🗺️", label: "Schedule a Tour", href: "#" },
              {
                icon: "💬",
                label: "Talk with an Admissions Counselor",
                href: "/contact",
              },
              {
                icon: "❓",
                label: "Request Information about our Programs",
                href: "/contact",
              },
            ].map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                style={{
                  background: "#fff",
                  textDecoration: "none",
                  padding: "18px 24px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#111",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {cta.icon} {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
