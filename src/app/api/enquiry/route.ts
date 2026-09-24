import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/enquiry-schema";
import { rejectBots, throttle } from "@/lib/form-guard";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { notifyNewEnquiry } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const bot = await rejectBots();
  if (bot) return bot;

  const body = await req.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const limited = await throttle(req, "enquiry", parsed.data.email);
  if (limited) return limited;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("enquiries").insert({
    name: parsed.data.name || null,
    email: parsed.data.email,
    organisation: parsed.data.organisation || null,
    role: parsed.data.role || null,
    intent: parsed.data.intent || null,
    message: parsed.data.message || null,
    source: "website",
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "Something went wrong – please try again." }, { status: 500 });
  }

  await notifyNewEnquiry(parsed.data).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 201 });
}
