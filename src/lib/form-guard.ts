import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase-server";

/**
 * The checks every public form runs before it stores anything or sends an
 * email: a bot check, then a throttle.
 *
 * The throttle lives in the database, not in memory, because each serverless
 * instance had its own memory, so a script spread over instances was barely
 * slowed. It counts per sender address and per email address: the forms send
 * an automatic reply to whatever address is typed in, so a limit per address
 * typed is what stops them being used to flood someone else's inbox.
 *
 * Neither the address nor the email is stored as typed: each is stored as
 * a keyed hash (HMAC with a server-only secret), which cannot be reversed by
 * trying every address without that secret, and rows are deleted after a
 * day. That is what the privacy page promises: IP addresses are logged
 * briefly for spam prevention and not kept beyond it.
 */

const WINDOW_MINUTES = 10;
/** Submissions from one sender address, across all forms, per window. */
const MAX_PER_ADDRESS = 5;
/** Submissions naming one email address, across all forms, per window. */
const MAX_PER_EMAIL = 3;
const RETENTION_HOURS = 24;

function hash(kind: "ip" | "email", value: string): string {
  // Keyed with the service-role key, the one server-only secret this
  // deployment already has. Rotating it only resets a day of throttle rows.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!key) throw new Error("Missing Supabase server environment variables");
  return createHmac("sha256", key).update(`${kind}:${value.trim().toLowerCase()}`).digest("hex");
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

const TOO_MANY = () =>
  NextResponse.json({ ok: false, error: "Too many requests – please try again shortly." }, { status: 429 });

/** Refuses automated submissions. Call first, before reading the body. */
export async function rejectBots(): Promise<NextResponse | null> {
  let verification;
  try {
    verification = await checkBotId();
  } catch (error) {
    // If the check itself fails (the service is unreachable, or the project
    // is not set up for it), the form still works: the throttle that follows
    // is the remaining protection. Refusing everyone would be worse.
    console.error("[form-guard] Bot check unavailable; relying on the throttle:", error);
    return null;
  }
  if (verification.isBot) {
    return NextResponse.json({ ok: false, error: "Your request could not be verified. Please try again." }, { status: 403 });
  }
  return null;
}

/**
 * Throttles one submission, recording it if it may proceed. If the database
 * cannot be reached the in-memory limit still applies, so a database outage
 * slows the forms' protection rather than taking the forms down.
 */
export async function throttle(req: NextRequest, form: string, email?: string): Promise<NextResponse | null> {
  const ip = clientIp(req);

  try {
    const subjects = [hash("ip", ip), ...(email ? [hash("email", email)] : [])];
    const supabase = getSupabaseServerClient();
    const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

    const counts = await Promise.all(
      subjects.map(async (subject) => {
        const { count, error } = await supabase
          .from("form_throttle")
          .select("id", { count: "exact", head: true })
          .eq("subject", subject)
          .gte("created_at", since);
        if (error) throw error;
        return count ?? 0;
      }),
    );
    if (counts[0] >= MAX_PER_ADDRESS || (counts[1] ?? 0) >= MAX_PER_EMAIL) return TOO_MANY();

    const { error: insertError } = await supabase
      .from("form_throttle")
      .insert(subjects.map((subject) => ({ subject, form })));
    if (insertError) throw insertError;

    // Housekeeping, best-effort: nothing here needs keeping past a day.
    const cutoff = new Date(Date.now() - RETENTION_HOURS * 3_600_000).toISOString();
    await supabase.from("form_throttle").delete().lt("created_at", cutoff);
    return null;
  } catch (error) {
    console.error("[form-guard] Throttle unavailable; falling back to the in-memory limit:", error);
    return checkRateLimit(ip) ? null : TOO_MANY();
  }
}
