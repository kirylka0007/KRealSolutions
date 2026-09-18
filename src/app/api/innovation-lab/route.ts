import { NextRequest, NextResponse } from "next/server";
import { innovationLabSchema } from "@/lib/innovation-lab-schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { notifyInnovationLabRequest } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests – please try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = innovationLabSchema.safeParse(body);
  if (!parsed.success) {
    const emailIssue = parsed.error?.issues.find((i) => i.path[0] === "email");
    return NextResponse.json(
      { ok: false, error: emailIssue?.message || "Please check the form and try again." },
      { status: 400 },
    );
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("innovation_lab_requests").insert({
    name: parsed.data.name,
    title: parsed.data.title,
    company: parsed.data.company,
    company_website: parsed.data.companyWebsite,
    industry: parsed.data.industry,
    reason: parsed.data.reason,
    email: parsed.data.email,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "Something went wrong – please try again." }, { status: 500 });
  }

  await notifyInnovationLabRequest(parsed.data).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 201 });
}
