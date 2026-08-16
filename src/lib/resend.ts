import type { EnquiryInput } from "./enquiry-schema";

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
