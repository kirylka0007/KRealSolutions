import { NextRequest, NextResponse } from "next/server";
import { innovationLabSchema } from "@/lib/innovation-lab-schema";
import { rejectBots, throttle } from "@/lib/form-guard";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { notifyInnovationLabRequest } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const bot = await rejectBots();
  if (bot) return bot;

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

  const limited = await throttle(req, "innovation-lab", parsed.data.email);
  if (limited) return limited;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("innovation_lab_requests").insert({
    name: parsed.data.name,
    title: parsed.data.title,
    company: parsed.data.company,
    company_website: parsed.data.companyWebsite,
    industry: parsed.data.industry,
    reason: parsed.data.reason,
    email: parsed.data.email,
    founding_cohort: parsed.data.foundingCohort,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "Something went wrong – please try again." }, { status: 500 });
  }

  await notifyInnovationLabRequest(parsed.data).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 201 });
}
