"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 40px",
      }}
    >
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 800,
          fontSize: "20px",
          color: "#F2A900",
          letterSpacing: "0.06em",
          marginBottom: "12px",
        }}
      >
        MICO UNIVERSITY
      </div>
      <h1
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 800,
          fontSize: "34px",
          color: "#111",
          margin: "0 0 12px",
        }}
      >
        Something went wrong
      </h1>
      <p style={{ fontSize: "16px", color: "#555", maxWidth: "520px" }}>
        We couldn&apos;t load this content right now. Please try again in a
        moment.
      </p>
      <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
        <button
          onClick={reset}
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            padding: "14px 28px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            background: "#F2A900",
            color: "#111",
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
    </div>
  );
}
