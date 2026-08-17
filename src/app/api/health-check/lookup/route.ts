import { NextRequest, NextResponse } from "next/server";
import { healthCheckLookupSchema } from "@/lib/health-check-lookup-schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { scoreMaturityTier, getRecommendation } from "@/lib/health-check-scoring";
import { sendHealthCheckResult } from "@/lib/resend";
import type { Industry, TeamSize, Maturity, Budget } from "@/types/health-check";
import type { IntentKey } from "@/types/intent";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests – please try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = healthCheckLookupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("health_check_responses")
    .select("*")
    .eq("email", parsed.data.email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data) {
    const tier = scoreMaturityTier(data.team_size as TeamSize, data.maturity as Maturity, data.budget as Budget);
    const recommendation = getRecommendation(data.aim as IntentKey, tier);
    await sendHealthCheckResult({
      name: data.name,
      email: data.email,
      industry: data.industry as Industry,
      teamSize: data.team_size as TeamSize,
      maturity: data.maturity as Maturity,
      budget: data.budget as Budget,
      aim: data.aim as IntentKey,
      painPoint: data.pain_point ?? "",
      honeypot: "",
      tier,
      recommendation,
    }).catch(() => {});
  }

  // Always the same response whether or not a match was found - avoids
  // leaking which email addresses have a stored result.
  return NextResponse.json({ ok: true });
}
