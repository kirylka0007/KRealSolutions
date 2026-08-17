"use client";
import { useState, type FormEvent } from "react";

export function HealthCheckLookup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    await fetch("/api/health-check/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="hc-result">
        <p>If we have a result for that email, we&apos;ve just sent it your way</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hc-email-form">
      <label>
        Email
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Looking…" : "Send my results"} <span className="arrow">→</span>
      </button>
    </form>
  );
}
