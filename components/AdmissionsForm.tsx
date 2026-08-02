"use client";

import { useState } from "react";

const STUDENT_TYPES = [
  "First-Year",
  "Transfer",
  "Graduate",
  "International",
  "Returning",
  "Non-Degree",
  "Online",
  "Exchange",
];

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

const sectionHeading: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  fontSize: "15px",
  color: "#111",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 16px",
  borderBottom: "2px solid #F2A900",
  paddingBottom: "8px",
};

export default function AdmissionsForm() {
  const [studentType, setStudentType] = useState("First-Year");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    school: "",
    term: "fall2027",
    major: "",
    agree: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState(""); // bots fill this; humans don't

  const setField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree || sending) return;
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
          form_type: "admissions",
          studentType,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          dob: form.dob,
          school: form.school,
          term: form.term,
          major: form.major,
          company: honeypot, // honeypot
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
      {/* Student Type */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={sectionHeading}>Student Type</h4>
        <div
          className="mico-studenttype-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            gap: "10px",
          }}
        >
          {STUDENT_TYPES.map((label) => {
            const selected = studentType === label;
            return (
              <label
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: `1.5px solid ${selected ? "#111" : "#ccc"}`,
                  borderRadius: "4px",
                  padding: "10px 12px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="studentType"
                  checked={selected}
                  onChange={() => setStudentType(label)}
                  style={{ accentColor: "#111" }}
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Personal Information */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={sectionHeading}>Personal Information</h4>
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
            <label style={labelStyle}>Legal First Name *</label>
            <input
              type="text"
              value={form.firstName}
              onChange={setField("firstName")}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Legal Last Name *</label>
            <input
              type="text"
              value={form.lastName}
              onChange={setField("lastName")}
              required
              style={inputStyle}
            />
          </div>
        </div>
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
            <label style={labelStyle}>Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={setField("email")}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={setField("phone")}
              required
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Date of Birth *</label>
          <input
            type="date"
            value={form.dob}
            onChange={setField("dob")}
            required
            style={inputStyle}
          />
        </div>
      </div>

      {/* Academic Background */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={sectionHeading}>Academic Background</h4>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Current or Most Recent School *</label>
          <input
            type="text"
            value={form.school}
            onChange={setField("school")}
            required
            style={inputStyle}
          />
        </div>
        <div
          className="mico-form-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label style={labelStyle}>Intended Term *</label>
            <select
              value={form.term}
              onChange={setField("term")}
              style={inputStyle}
            >
              <option value="fall2027">Fall 2027</option>
              <option value="spring2027">Spring 2027</option>
              <option value="summer2027">Summer 2027</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Intended Major</label>
            <input
              type="text"
              value={form.major}
              onChange={setField("major")}
              placeholder="e.g. Biology, Business"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          fontSize: "13px",
          color: "#555",
          marginBottom: "28px",
        }}
      >
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))}
          style={{ marginTop: "2px", accentColor: "#111" }}
        />
        I certify that the information provided is accurate and I authorize Mico
        University to verify it as part of the admissions review.
      </label>

      {/* Honeypot — visually hidden, off-screen; real users never fill it. */}
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
        disabled={!form.agree || sending}
        style={{
          width: "100%",
          background: form.agree && !sending ? "#111" : "#999",
          color: "#fff",
          border: "none",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          padding: "16px",
          borderRadius: "4px",
          cursor: form.agree && !sending ? "pointer" : "not-allowed",
        }}
      >
        {sending ? "Submitting…" : "Submit Application"}
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
          ✓ Application received — a confirmation email is on its way to{" "}
          {form.email}.
        </p>
      )}
    </form>
  );
}
