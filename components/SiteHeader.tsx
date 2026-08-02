"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Top utility bar + main gold nav.
 * Desktop markup/inline styles are lifted verbatim from the source design so the
 * appearance is byte-for-byte identical at >=901px. Below 900px the horizontal
 * nav is replaced by a hamburger button that opens a slide-in drawer.
 * `active` underlines/highlights the current nav item.
 */

const NAV_LINKS: { label: string; href: string; key: string }[] = [
  { label: "About", href: "/", key: "about" },
  { label: "Admissions", href: "/admissions", key: "admissions" },
  { label: "Academics", href: "#", key: "academics" },
  { label: "Research", href: "#", key: "research" },
  { label: "Student Life", href: "#", key: "student-life" },
  { label: "Athletics", href: "#", key: "athletics" },
  { label: "Alumni & Giving", href: "#", key: "alumni" },
  { label: "Contact", href: "/contact", key: "contact" },
];

export default function SiteHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Responsive rules: hide desktop nav / show hamburger under 900px,
          and tighten the horizontal padding on small screens. */}
      <style>{`
        .mico-topbar { padding: 8px 40px; }
        .mico-navbar { padding: 12px 40px; }
        .mico-nav-desktop { display: flex; }
        .mico-hamburger { display: none; }
        @media (max-width: 900px) {
          .mico-topbar { padding: 8px 20px; }
          .mico-navbar { padding: 12px 20px; }
          .mico-nav-desktop { display: none; }
          .mico-hamburger { display: flex; }
        }
      `}</style>

      {/* Top utility bar */}
      <div
        className="mico-topbar"
        style={{
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
          letterSpacing: "0.06em",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
        }}
      >
        <span>MICO UNIVERSITY</span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            🔒 MICO PORTALS ▾
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            🔍 SEARCH
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div
        className="mico-navbar"
        style={{
          background: "#F2A900",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            textDecoration: "none",
          }}
        >
          <img
            src="/assets/mico-crest.jpeg"
            alt="Mico University crest"
            style={{
              height: "56px",
              width: "56px",
              objectFit: "contain",
              background: "#fff",
              borderRadius: "6px",
              padding: "3px",
            }}
          />
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "0.02em",
              color: "#111",
            }}
          >
            MICO UNIVERSITY
          </div>
        </Link>

        {/* Desktop nav (unchanged design) */}
        <nav
          className="mico-nav-desktop"
          style={{
            gap: "28px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            color: "#111",
          }}
        >
          {NAV_LINKS.map((l) => {
            const isActive = active === l.key;
            return (
              <Link
                key={l.key}
                href={l.href}
                style={{
                  textDecoration: "none",
                  color: "#111",
                  ...(isActive
                    ? { borderBottom: "2px solid #111", paddingBottom: "4px" }
                    : {}),
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Hamburger button (mobile only) */}
        <button
          className="mico-hamburger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5px",
            padding: "6px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "26px",
                height: "3px",
                background: "#111",
                borderRadius: "2px",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer + backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "min(300px, 82vw)",
              height: "100%",
              background: "#F2A900",
              boxShadow: "-4px 0 24px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: "16px",
                  color: "#111",
                }}
              >
                MENU
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "26px",
                  lineHeight: 1,
                  color: "#111",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "17px",
              }}
            >
              {NAV_LINKS.map((l) => {
                const isActive = active === l.key;
                return (
                  <Link
                    key={l.key}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    style={{
                      textDecoration: "none",
                      color: "#111",
                      padding: "12px 8px",
                      borderBottom: "1px solid rgba(0,0,0,0.12)",
                      fontWeight: isActive ? 800 : 600,
                    }}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
