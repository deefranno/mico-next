import Link from "next/link";

/**
 * Breadcrumb hero banner matching the Admissions/Contact page design.
 * Uses a featured image if provided, else a neutral gradient placeholder.
 */
export default function PageHero({
  title,
  subtitle,
  crumb,
  image,
  height = 320,
}: {
  title: string;
  subtitle?: string;
  crumb: string;
  image?: string | null;
  height?: number;
}) {
  return (
    <div style={{ position: "relative", width: "100%", height: `${height}px` }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: image
            ? `url("${image}") center / cover no-repeat`
            : "linear-gradient(135deg, #2a2a2a 0%, #555 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="mico-hero-pad"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "900px",
          padding: "100px 0 0 40px",
        }}
      >
        <div style={{ fontSize: "13px", color: "#ddd", marginBottom: "14px" }}>
          <Link
            href="/"
            style={{
              color: "#ddd",
              textDecorationColor: "rgba(255,255,255,0.4)",
            }}
          >
            Home
          </Link>{" "}
          / <span style={{ color: "#fff" }}>{crumb}</span>
        </div>
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "44px",
            lineHeight: 1.1,
            color: "#fff",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "24px",
              fontStyle: "italic",
              color: "#F2A900",
              margin: "10px 0 0",
            }}
          >
            {subtitle}
          </h2>
        )}
      </div>
    </div>
  );
}
