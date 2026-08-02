import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Mico University",
  description:
    "Founded in 1836, Mico University turns curiosity into achievement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "#1a1a1a",
          width: "100%",
          overflowX: "hidden",
          margin: 0,
          background: "#fff",
        }}
      >
        {children}
      </body>
    </html>
  );
}
