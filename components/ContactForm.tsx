"use client";

import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1.5px solid #ccc",
  borderRadius: "4px",
  fontSize: "15px",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#333",
  marginBottom: "6px",
};

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "admissions",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const setField =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");

    const endpoint = process.env.NEXT_PUBLIC_WP_FORM_ENDPOINT;
    if (!endpoint) {
      setError("Form is not configured. Please email us directly.");
      setSending(false);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "contact",
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          company: honeypot,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError(
        "We couldn't submit right now. Please try again or email us directly."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="mico-form-2"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div>
          <label style={labelStyle}>Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={setField("name")}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={setField("email")}
            required
            style={inputStyle}
          />
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Subject</label>
        <select
          value={form.subject}
          onChange={setField("subject")}
          style={inputStyle}
        >
          <option value="admissions">Admissions</option>
          <option value="academics">Academics</option>
          <option value="financial-aid">Financial Aid</option>
          <option value="general">General Inquiry</option>
        </select>
      </div>
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Message *</label>
        <textarea
          value={form.message}
          onChange={setField("message")}
          required
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Honeypot — off-screen; real users never fill it. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={sending}
        style={{
          width: "100%",
          background: sending ? "#999" : "#111",
          color: "#fff",
          border: "none",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          padding: "16px",
          borderRadius: "4px",
          cursor: sending ? "not-allowed" : "pointer",
        }}
      >
        {sending ? "Sending…" : "Send Message"}
      </button>
      {error && (
        <p
          style={{
            textAlign: "center",
            color: "#c0392b",
            fontWeight: 600,
            fontSize: "14px",
            margin: "20px 0 0",
          }}
        >
          {error}
        </p>
      )}
      {submitted && (
        <p
          style={{
            textAlign: "center",
            color: "#1a7a3a",
            fontWeight: 600,
            fontSize: "14px",
            margin: "20px 0 0",
          }}
        >
          ✓ Message sent — we&apos;ll get back to you at {form.email} shortly.
        </p>
      )}
    </form>
  );
}
