"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useIntent } from "@/context/IntentContext";
import { INTENT_LABELS } from "@/types/intent";
import type { IntentKey } from "@/types/intent";
import {
  INDUSTRY_LABELS,
  TEAM_SIZE_LABELS,
  MATURITY_LABELS,
  BUDGET_LABELS,
  type Industry,
  type TeamSize,
  type Maturity,
  type Budget,
} from "@/types/health-check";
import { scoreMaturityTier, getRecommendation, MATURITY_TIER_LABELS } from "@/lib/health-check-scoring";

type Answers = {
  industry: Industry | "";
  teamSize: TeamSize | "";
  maturity: Maturity | "";
  budget: Budget | "";
  aim: IntentKey | "";
  painPoint: string;
  name: string;
  email: string;
  honeypot: string;
};

const EMPTY_ANSWERS: Answers = {
  industry: "",
  teamSize: "",
  maturity: "",
  budget: "",
  aim: "",
  painPoint: "",
  name: "",
  email: "",
  honeypot: "",
};

type Status = "answering" | "submitting" | "result" | "error";

export function HealthCheckQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [status, setStatus] = useState<Status>("answering");
  const [errorMsg, setErrorMsg] = useState("");
  const { setIntent } = useIntent();

  const TOTAL_STEPS = 7; // industry, teamSize, maturity, budget, aim, painPoint, email

  function selectAndAdvance<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  async function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!answers.industry || !answers.teamSize || !answers.maturity || !answers.budget || !answers.aim) return;
    setStatus("submitting");

    const res = await fetch("/api/health-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });

    if (res.ok) {
      setStatus("result");
    } else {
      const body = await res.json().catch(() => ({ error: "Something went wrong." }));
      setErrorMsg(body.error || "Something went wrong.");
      setStatus("error");
    }
  }

  function bookConversation() {
    if (answers.aim) setIntent(answers.aim);
  }

  if (status === "result" && answers.teamSize && answers.maturity && answers.budget && answers.aim) {
    const tier = scoreMaturityTier(answers.teamSize, answers.maturity, answers.budget);
    const rec = getRecommendation(answers.aim, tier);
    return (
      <div className="hc-result">
        <span className="tier">{MATURITY_TIER_LABELS[tier]}</span>
        <h2>{rec.headline}</h2>
        <p>{rec.body}</p>
        <p style={{ marginTop: 18, fontSize: ".85rem", color: "var(--paper-text-soft)" }}>
          We&apos;ve emailed a copy of this to {answers.email}.
        </p>
        <Link href="/#contact" className="btn btn-primary" style={{ marginTop: 24 }} onClick={bookConversation}>
          Book a conversation <span className="arrow">→</span>
        </Link>
      </div>
    );
  }

  const progress = Math.min(step, TOTAL_STEPS);

  return (
    <div className="hc">
      <div className="hc-progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span key={i} className={i < progress ? "done" : ""} />
        ))}
      </div>

      <div className="hc-step">
        {step === 0 && (
          <>
            <h2>What industry are you in?</h2>
            <select
              className="hc-select"
              value={answers.industry}
              onChange={(e) => selectAndAdvance("industry", e.target.value as Industry)}
            >
              <option value="" disabled>
                Choose an industry
              </option>
              {(Object.keys(INDUSTRY_LABELS) as Industry[]).map((key) => (
                <option key={key} value={key}>
                  {INDUSTRY_LABELS[key]}
                </option>
              ))}
            </select>
          </>
        )}

        {step === 1 && (
          <>
            <h2>How big is your audit team?</h2>
            <div className="hc-options">
              {(Object.keys(TEAM_SIZE_LABELS) as TeamSize[]).map((key) => (
                <button key={key} className="hc-option" onClick={() => selectAndAdvance("teamSize", key)}>
                  {TEAM_SIZE_LABELS[key]}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>What&apos;s your current data & analytics maturity?</h2>
            <div className="hc-options">
              {(Object.keys(MATURITY_LABELS) as Maturity[]).map((key) => (
                <button key={key} className="hc-option" onClick={() => selectAndAdvance("maturity", key)}>
                  {MATURITY_LABELS[key]}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>What&apos;s your analytics/AI budget appetite?</h2>
            <div className="hc-options">
              {(Object.keys(BUDGET_LABELS) as Budget[]).map((key) => (
                <button key={key} className="hc-option" onClick={() => selectAndAdvance("budget", key)}>
                  {BUDGET_LABELS[key]}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2>What&apos;s your primary aim?</h2>
            <div className="hc-options">
              {(Object.keys(INTENT_LABELS) as IntentKey[]).map((key) => (
                <button key={key} className="hc-option" onClick={() => selectAndAdvance("aim", key)}>
                  {INTENT_LABELS[key]}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2>What&apos;s your biggest current pain point?</h2>
            <textarea
              className="hc-textarea"
              rows={4}
              placeholder="Optional – tell us more if you'd like"
              value={answers.painPoint}
              onChange={(e) => setAnswers((a) => ({ ...a, painPoint: e.target.value }))}
            />
            <div className="hc-nav">
              <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
                Next <span className="arrow">→</span>
              </button>
            </div>
          </>
        )}

        {step === 6 && (
          <form onSubmit={handleEmailSubmit} className="hc-email-form">
            <h2>Where should we send your results?</h2>
            <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
              <label htmlFor="hc_company_website">Leave this field empty</label>
              <input
                type="text"
                id="hc_company_website"
                tabIndex={-1}
                autoComplete="off"
                value={answers.honeypot}
                onChange={(e) => setAnswers((a) => ({ ...a, honeypot: e.target.value }))}
              />
            </div>
            <label>
              Name
              <input
                type="text"
                required
                autoComplete="name"
                value={answers.name}
                onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={answers.email}
                onChange={(e) => setAnswers((a) => ({ ...a, email: e.target.value }))}
              />
            </label>
            {status === "error" && (
              <p role="alert" style={{ color: "var(--exception-red)" }}>
                {errorMsg}
              </p>
            )}
            <div className="hc-nav">
              <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
                {status === "submitting" ? "Scoring…" : "See my results"} <span className="arrow">→</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
