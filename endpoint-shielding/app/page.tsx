"use client";

import React, { useState } from "react";

interface LookupPayload {
  code?: string;
  status?: string;
  maskedEmail?: string;
  maskedPhone?: string;
  error?: string;
}

export default function HomePage() {
  const [code, setCode] = useState("CERT-101");
  const [result, setResult] = useState<LookupPayload | null>(null);
  const [loading, setLoading] = useState(false);

  async function runLookup() {
    const trimmed = code.trim();
    if (!trimmed) {
      setResult({ error: "Please enter a lookup code." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/lookup/${encodeURIComponent(trimmed)}`);
      const data: LookupPayload = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Unable to reach /api/lookup right now." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 540, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Public Record Lookup</h1>
      <p>Verify record status while keeping personal contact details masked.</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              runLookup();
            }
          }}
          placeholder="Enter code (e.g. CERT-101)"
          style={{ flex: 1, padding: "8px 12px", fontSize: 16 }}
        />
        <button
          type="button"
          onClick={runLookup}
          disabled={loading}
          style={{ padding: "8px 16px", fontSize: 16, cursor: "pointer" }}
        >
          {loading ? "Looking up..." : "Lookup"}
        </button>
      </div>

      {result?.error && (
        <div style={{ marginTop: 16, padding: 12, background: "#fee2e2", color: "#991b1b", borderRadius: 6 }}>
          {result.error}
        </div>
      )}

      {result && !result.error && (
        <div style={{ marginTop: 16, padding: 16, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 6 }}>
          <p><strong>Code:</strong> {result.code}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Masked Email:</strong> {result.maskedEmail}</p>
          <p><strong>Masked Phone:</strong> {result.maskedPhone}</p>
        </div>
      )}
    </main>
  );
}