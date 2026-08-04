"use client";

import Link from "next/link";

export default function ChoosePage() {
  return (
    <div
      style={{
        backgroundColor: "#255799",
        color: "#fecc07",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "32px",
      }}
    >
      <p style={{ textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: "8px" }}>
        UCI ride matching
      </p>
      <h1 style={{ fontSize: "3rem", marginBottom: "12px" }}>Find a compatible carpool</h1>
      <p style={{ maxWidth: "680px", color: "#fff", lineHeight: 1.6, marginBottom: "30px" }}>
        ZotPool ranks open rides using pickup and destination distance, departure time,
        available seats, and luggage capacity.
      </p>
      <Link
        href="/carpool"
        style={{
          backgroundColor: "#fecc07",
          color: "#255799",
          padding: "18px 32px",
          fontSize: "1.2rem",
          fontWeight: 700,
          borderRadius: "12px",
          textDecoration: "none",
        }}
      >
        Start matching
      </Link>
      <p style={{ marginTop: "24px", color: "#dbeafe" }}>
        Travel Buddy matching is planned for the next release.
      </p>
    </div>
  );
}
