import { NextRequest, NextResponse } from "next/server";
import { healthCheckSchema } from "@/lib/health-check-schema";
import { rejectBots, throttle } from "@/lib/form-guard";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { scoreMaturityTier, getRecommendation } from "@/lib/health-check-scoring";
import { sendHealthCheckResult } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const bot = await rejectBots();
  if (bot) return bot;

  const body = await req.json().catch(() => null);
  const parsed = healthCheckSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check your answers and try again." }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const limited = await throttle(req, "health-check", parsed.data.email);
  if (limited) return limited;

  const tier = scoreMaturityTier(parsed.data.teamSize, parsed.data.maturity, parsed.data.budget);
  const recommendation = getRecommendation(parsed.data.aim, tier);

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("health_check_responses").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    industry: parsed.data.industry,
    team_size: parsed.data.teamSize,
    maturity: parsed.data.maturity,
    budget: parsed.data.budget,
    aim: parsed.data.aim,
    pain_point: parsed.data.painPoint || null,
    maturity_tier: tier,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "Something went wrong – please try again." }, { status: 500 });
  }

  await sendHealthCheckResult({ ...parsed.data, tier, recommendation }).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 201 });
}
