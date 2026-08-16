"use client";
import { useState, type FormEvent } from "react";
import { useIntent } from "@/context/IntentContext";
import type { IntentKey } from "@/types/intent";

const INTENT_LABELS: Record<IntentKey, string> = {
  genai: "Get value from GenAI in audit",
  starting: "Start our data-analytics journey",
  tools: "Get more from tools we own",
  continuous: "Move to continuous assurance",
  exploring: "Not sure yet",
};

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm() {
  const { intent } = useIntent();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<IntentKey | "">(intent ?? "");
  const [prevIntent, setPrevIntent] = useState(intent);
  if (intent !== prevIntent) {
    setPrevIntent(intent);
    if (intent) setSelectedIntent(intent);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      organisation: String(data.get("organisation") || ""),
      role: String(data.get("role") || ""),
      intent: (data.get("intent") as IntentKey) || undefined,
      message: String(data.get("message") || ""),
      honeypot: String(data.get("company_website") || ""),
    };

    const res = await fetch("/api/enquiry", {
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
        <h4>Thanks – that&apos;s landed</h4>
        <p>I&apos;ll get back to you shortly to find a time to talk.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div style={{ display: "grid", gap: 14, textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <label>
          Name
          <input type="text" name="name" autoComplete="name" />
        </label>
        <label>
          Email *
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Organisation
          <input type="text" name="organisation" autoComplete="organization" />
        </label>
        <label>
          Role
          <input type="text" name="role" />
        </label>
        <label>
          What would you like to talk about?
          <select
            name="intent"
            value={selectedIntent}
            onChange={(e) => setSelectedIntent(e.target.value as IntentKey | "")}
          >
            <option value="">Not sure yet</option>
            {(Object.keys(INTENT_LABELS) as IntentKey[]).map((key) => (
              <option key={key} value={key}>
                {INTENT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Message
          <textarea name="message" rows={4} />
        </label>

        {status === "error" && (
          <p role="alert" style={{ color: "var(--exception-red)" }}>
            {errorMsg}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Book a conversation"} <span className="arrow">→</span>
        </button>
      </div>
    </form>
  );
}
