import type { EnquiryInput } from "./enquiry-schema";
import type { HealthCheckInput } from "./health-check-schema";
import type { MaturityTier } from "@/types/health-check";

export async function notifyNewEnquiry(input: EnquiryInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "K Real Solutions website <onboarding@resend.dev>",
      to,
      subject: `New enquiry from ${input.name || input.email}`,
      text: [
        `Name: ${input.name || "—"}`,
        `Email: ${input.email}`,
        `Organisation: ${input.organisation || "—"}`,
        `Role: ${input.role || "—"}`,
        `Intent: ${input.intent || "—"}`,
        `Message: ${input.message || "—"}`,
      ].join("\n"),
    }),
  });
}

type HealthCheckResultInput = HealthCheckInput & {
  tier: MaturityTier;
  recommendation: { headline: string; body: string };
};

export async function sendHealthCheckResult(input: HealthCheckResultInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "K Real Solutions website <onboarding@resend.dev>",
      to: input.email,
      subject: "Your K Real Solutions health-check result",
      text: [
        `Hi ${input.name},`,
        "",
        input.recommendation.headline,
        input.recommendation.body,
        "",
        "Book a conversation: https://krealsolutions.co.uk/#contact",
        "Look up this result again anytime: https://krealsolutions.co.uk/health-check/lookup",
      ].join("\n"),
    }),
  });

  const notifyTo = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!notifyTo) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "K Real Solutions website <onboarding@resend.dev>",
      to: notifyTo,
      subject: `New health-check completion from ${input.name}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Industry: ${input.industry}`,
        `Team size: ${input.teamSize}`,
        `Maturity: ${input.maturity}`,
        `Budget: ${input.budget}`,
        `Aim: ${input.aim}`,
        `Maturity tier: ${input.tier}`,
        `Pain point: ${input.painPoint || "—"}`,
      ].join("\n"),
    }),
  });
}
