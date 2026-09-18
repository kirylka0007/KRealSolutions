"use client";
import { useState, type FormEvent } from "react";
import { INDUSTRY_LABELS, type Industry } from "@/types/health-check";

type Status = "idle" | "submitting" | "success" | "error";

export function InnovationLabForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      title: String(data.get("title") || ""),
      company: String(data.get("company") || ""),
      companyWebsite: String(data.get("companyWebsite") || ""),
      industry: String(data.get("industry") || ""),
      reason: String(data.get("reason") || ""),
      email: String(data.get("email") || ""),
      honeypot: String(data.get("company_role") || ""),
    };

    const res = await fetch("/api/innovation-lab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      const body = await res.json().catch(() => ({ error: "Something went wrong." }));
      setErrorMsg(body.error || "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="offer" role="status">
        <h4>Request received</h4>
        <p>We review every request by hand. If it&apos;s a good fit, we&apos;ll email you your access details.</p>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="company_role">Leave this field empty</label>
        <input type="text" id="company_role" name="company_role" tabIndex={-1} autoComplete="off" />
      </div>

      <div style={{ display: "grid", gap: 14, textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <label>
          Name *
          <input type="text" name="name" required autoComplete="name" />
        </label>
        <label>
          Job title *
          <input type="text" name="title" required autoComplete="organization-title" />
        </label>
        <label>
          Company *
          <input type="text" name="company" required autoComplete="organization" />
        </label>
        <label>
          Company website *
          <input type="text" name="companyWebsite" required placeholder="yourcompany.com" />
        </label>
        <label>
          Industry *
          <select name="industry" required defaultValue="">
            <option value="" disabled>
              Choose an industry
            </option>
            {(Object.keys(INDUSTRY_LABELS) as Industry[]).map((key) => (
              <option key={key} value={key}>
                {INDUSTRY_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Work email *
          <input type="email" name="email" required autoComplete="email" placeholder="you@yourcompany.com" />
        </label>
        <label>
          Why are you interested? *
          <textarea name="reason" rows={4} required />
        </label>

        {status === "error" && (
          <p role="alert" style={{ color: "var(--exception-red)" }}>
            {errorMsg}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request access"} <span className="arrow">→</span>
        </button>
      </div>
    </form>
  );
}
