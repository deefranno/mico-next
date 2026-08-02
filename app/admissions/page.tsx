import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import PageHero from "../../components/PageHero";
import AdmissionsForm from "../../components/AdmissionsForm";
import { getPageAcf, acfText, acfImage } from "../../lib/wp";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Admissions — Mico University",
  description: "Your opportunity starts now. Apply to Mico University.",
};

export default async function AdmissionsPage() {
  const acf = await getPageAcf(72); // Admissions page in WordPress

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1a1a1a" }}>
      <SiteHeader active="admissions" />

      <PageHero
        title={acfText(acf, "adm_hero_title", "Admissions")}
        subtitle={acfText(acf, "adm_hero_subtitle", "Your Opportunity Starts Now")}
        crumb="Admissions"
        image={acfImage(acf, "adm_hero_image")}
        height={460}
      />

      {/* Ready to set your future in motion */}
      <div
        style={{
          padding: "80px 40px 40px",
          maxWidth: "1000px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "34px",
            color: "#111",
            margin: "0 0 20px",
          }}
        >
          {acfText(acf, "adm_intro_heading", "Ready to Set Your Future in Motion?")}
        </h2>
        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.7,
            color: "#3a3a3a",
            margin: "0 0 32px",
          }}
        >
          {acfText(
            acf,
            "adm_intro_body",
            "Founded in 1836, Mico has spent generations turning ambition into achievement. You can launch the next great enterprise, lead groundbreaking research or become an agent of change in your community. It all starts with your application."
          )}
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a
            href="#apply"
            style={{
              textDecoration: "none",
              background: "#111",
              color: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              padding: "16px 36px",
            }}
          >
            Apply
          </a>
        </div>
      </div>

      {/* Application Form */}
      <div
        id="apply"
        style={{ padding: "0 40px 96px", maxWidth: "900px", margin: "0 auto" }}
      >
        <div
          style={{
            border: "1px solid #e4e4e4",
            borderRadius: "4px",
            padding: "48px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "30px",
              color: "#111",
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            {acfText(acf, "adm_form_heading", "Start Your Application")}
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#555",
              margin: "0 0 36px",
              textAlign: "center",
            }}
          >
            {acfText(acf, "adm_form_subheading", "Fields marked with * are required.")}
          </p>
          <AdmissionsForm />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
