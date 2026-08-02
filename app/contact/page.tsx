import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import PageHero from "../../components/PageHero";
import ContactForm from "../../components/ContactForm";
import { getPageAcf, acfText, acfImage } from "../../lib/wp";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us — Mico University",
  description: "Get in touch with Mico University.",
};

const social = [
  {
    href: "https://www.facebook.com/themicoonline",
    bg: "#1877F2",
    svg: (
      <svg width="19.8" height="19.8" viewBox="0 0 24 24" fill="#fff">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/themicoonline",
    bg: "radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    svg: (
      <svg
        width="19.8"
        height="19.8"
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
        <path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-6.9L4.7 22H1.6l8.2-9.4L1 2h7.1l4.9 6.3L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@micouniversityable",
    bg: "#FF0000",
    svg: (
      <svg width="19.8" height="19.8" viewBox="0 0 24 24" fill="#fff">
        <path d="M10 15.5l6-3.5-6-3.5v7zM12 4c4.4 0 7.5.3 7.5.3 1 .1 2.1 1 2.3 2 0 0 .2 1.5.2 3.7v2c0 2.2-.2 3.7-.2 3.7-.2 1-1.3 1.9-2.3 2 0 0-3.1.3-7.5.3s-7.5-.3-7.5-.3c-1-.1-2.1-1-2.3-2 0 0-.2-1.5-.2-3.7v-2c0-2.2.2-3.7.2-3.7.2-1 1.3-1.9 2.3-2C4.5 4.3 7.6 4 12 4z" />
      </svg>
    ),
  },
];

export default async function ContactPage() {
  const acf = await getPageAcf(74); // Contact page in WordPress

  const campusLines = acfText(acf, "con_campus_lines", "1A Marescaux Road\nKingston 5")
    .split("\n")
    .filter((l) => l.trim() !== "");

  const contactRows = [
    { icon: "📍", h: "Main Campus", lines: campusLines },
    { icon: "📞", h: "Phone", lines: [acfText(acf, "con_phone", "(876) 929-5260")] },
    { icon: "✉️", h: "Email", lines: [acfText(acf, "con_email", "info@mico.edu")] },
    {
      icon: "🕘",
      h: "Office Hours",
      lines: [acfText(acf, "con_hours", "Mon–Fri, 8:00am – 5:00pm")],
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1a1a1a" }}>
      <SiteHeader active="contact" />

      <PageHero
        title={acfText(acf, "con_hero_title", "Contact Us")}
        crumb="Contact Us"
        image={acfImage(acf, "con_hero_image")}
        height={320}
      />

      {/* Contact info + form */}
      <div
        className="mico-contact-grid"
        style={{
          padding: "80px 40px",
          maxWidth: "1300px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "64px",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "26px",
              color: "#111",
              margin: "0 0 24px",
            }}
          >
            {acfText(acf, "con_getintouch_heading", "Get in Touch")}
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "22px" }}
          >
            {contactRows.map((row) => (
              <div key={row.h} style={{ display: "flex", gap: "14px" }}>
                <span style={{ fontSize: "20px" }}>{row.icon}</span>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      margin: "0 0 4px",
                    }}
                  >
                    {row.h}
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {row.lines.map((l, i) => (
                      <span key={i}>
                        {l}
                        {i < row.lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <h4
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              margin: "32px 0 12px",
            }}
          >
            Follow Mico
          </h4>
          <div style={{ display: "flex", gap: "12px" }}>
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
                  width: "36px",
                  height: "36px",
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

        <div
          style={{
            border: "1px solid #e4e4e4",
            borderRadius: "4px",
            padding: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "24px",
              color: "#111",
              margin: "0 0 24px",
            }}
          >
            {acfText(acf, "con_form_heading", "Send Us a Message")}
          </h2>
          <ContactForm />
        </div>
      </div>

      {/* Map */}
      <div
        className="mico-pad"
        style={{ padding: "0 40px 96px", maxWidth: "1300px", margin: "0 auto" }}
      >
        {acfText(acf, "con_map_embed", "") ? (
          <iframe
            src={acfText(acf, "con_map_embed", "")}
            style={{
              width: "100%",
              height: "360px",
              border: 0,
              borderRadius: "4px",
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Campus location map"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "360px",
              borderRadius: "4px",
              background: "linear-gradient(135deg, #e8e6e1 0%, #d4d0c8 100%)",
            }}
          />
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
