/**
 * Black footer with three columns + social row.
 * Markup/inline styles lifted verbatim from the source design.
 */
const goldLink = {
  color: "#F2A900",
  textDecorationColor: "rgba(242,169,0,0.4)",
} as const;

const social = [
  {
    href: "https://www.facebook.com/themicoonline",
    bg: "#1877F2",
    svg: (
      <svg width="17.6" height="17.6" viewBox="0 0 24 24" fill="#fff">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/themicoonline",
    bg: "radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    svg: (
      <svg
        width="17.6"
        height="17.6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth={2}
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://x.com/themicoonline",
    bg: "#000",
    border: "1px solid #333",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
        <path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-6.9L4.7 22H1.6l8.2-9.4L1 2h7.1l4.9 6.3L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@micouniversityable",
    bg: "#FF0000",
    svg: (
      <svg width="17.6" height="17.6" viewBox="0 0 24 24" fill="#fff">
        <path d="M10 15.5l6-3.5-6-3.5v7zM12 4c4.4 0 7.5.3 7.5.3 1 .1 2.1 1 2.3 2 0 0 .2 1.5.2 3.7v2c0 2.2-.2 3.7-.2 3.7-.2 1-1.3 1.9-2.3 2 0 0-3.1.3-7.5.3s-7.5-.3-7.5-.3c-1-.1-2.1-1-2.3-2 0 0-.2-1.5-.2-3.7v-2c0-2.2.2-3.7.2-3.7.2-1 1.3-1.9 2.3-2C4.5 4.3 7.6 4 12 4z" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <div style={{ background: "#000", color: "#fff", padding: "64px 40px 32px" }}>
      <div
        className="mico-footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "40px",
          maxWidth: "1400px",
          margin: "0 auto 48px",
        }}
      >
        <div>
          <h4
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "17px",
              margin: "0 0 18px",
            }}
          >
            Explore Mico
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            {[
              "About",
              "Admissions",
              "Academics",
              "Locations",
              "Research",
              "Student Life",
              "Athletics",
              "Alumni & Giving",
            ].map((t) => (
              <a key={t} href="#" style={goldLink}>
                {t}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "17px",
              margin: "0 0 18px",
            }}
          >
            Tools &amp; Resources
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            {[
              "Phonebook (Directory)",
              "University Calendar",
              "Campus Maps",
              "MyMico",
              "Canvas",
              "Mico Email",
              "Nondiscrimination",
              "Title IX",
            ].map((t) => (
              <a key={t} href="#" style={goldLink}>
                {t}
              </a>
            ))}
          </div>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            <img
              src="/assets/mico-crest.jpeg"
              alt="Mico University crest"
              style={{
                height: "64px",
                width: "64px",
                objectFit: "contain",
                background: "#fff",
                borderRadius: "6px",
                padding: "4px",
              }}
            />
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "18px",
                lineHeight: 1.2,
              }}
            >
              MICO
              <br />
              UNIVERSITY
            </div>
          </div>
          <h4
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              margin: "0 0 12px",
            }}
          >
            Connect
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            <a href="#" style={{ color: "#F2A900" }}>
              Contact Us
            </a>
            <a href="#" style={{ color: "#F2A900" }}>
              Mico News
            </a>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: s.bg,
                  border: s.border,
                }}
              >
                {s.svg}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: "24px",
          textAlign: "center",
          fontSize: "13px",
          color: "#999",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        © 2026 Mico University |{" "}
        <a href="#" style={{ color: "#999" }}>
          Accessibility
        </a>{" "}
        |{" "}
        <a href="#" style={{ color: "#999" }}>
          Website Feedback
        </a>{" "}
        |{" "}
        <a href="#" style={{ color: "#999" }}>
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
