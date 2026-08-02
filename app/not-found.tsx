import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function NotFound() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader />
      <div
        style={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "96px 40px",
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "72px",
            color: "#F2A900",
            lineHeight: 1,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "30px",
            color: "#111",
            margin: "16px 0 12px",
          }}
        >
          Page not found
        </h1>
        <p style={{ fontSize: "16px", color: "#555", maxWidth: "480px" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          style={{
            marginTop: "28px",
            background: "#111",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            padding: "14px 28px",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Back to home
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}
