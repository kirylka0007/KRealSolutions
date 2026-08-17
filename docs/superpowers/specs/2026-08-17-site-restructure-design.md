# K Real Solutions website — restructure to multi-page, "we" voice, QA fixes

**Context:** the site (spec: `2026-08-15-krealsolutions-website-design.md`) is built and functionally complete through Task 15, with most of Task 16's QA fixes already committed (honeypot validation, focus-visible outline, mobile-nav keyboard trap, em dash → en dash / trailing-period copy sweep). This spec covers a second round of changes driven by the user reviewing the live site: restructuring from one long single-page scroll into a landing page + three subpages, switching copy voice from "I" to "we", dropping internal case/service ID codes, and fixing three remaining bugs found during review.

## Decisions confirmed with the client (user)

- **Structure:** landing page (`/`) + three subpages — `/services`, `/work`, `/how-we-work`. Contact form stays on the homepage only; every subpage CTA links back to `/#contact`.
- **Voice:** all service/case/process copy switches from "I" to "we". The credentials/bio section becomes a third-person founder bio ("Founded by Kiryl — FCCA-qualified, MSc Data Science...") rather than either staying first-person or erasing the founder entirely — honest about being founder-led while reading as an organisation.
- **ID codes:** drop the `CCM-01` / `GENAI-03` / `PM-01` style tags everywhere (both service cards and case cards). The existing plain-word category (`cap` field on `Cases.tsx`, e.g. "Continuous monitoring") already covers what a reader needs and stays.
- **StatBand vs Coverage:** the two sections argue the same point twice in a row (sample-based testing has gaps → here's the cost, immediately followed by 5% sample → 100% monitored). Cut `StatBand` entirely; keep `Coverage` (the dot-grid comparison is the stronger, more distinctive visual, and its own payoff stat — "53% lower fraud losses" — already carries a cited number). No id currently links to `StatBand`'s `#problem` anchor, so removal is clean.
- **Landing page composition:** Hero → Chooser → Coverage → Services teaser (6 short cards, no full descriptions, no ID codes, linking into `/services#<slug>`) → Work teaser (3 strongest case studies, linking to `/work`) → a health-assessment CTA card (see below) → Contact.
- **Interactive health assessment (new):** a 6-question quiz at `/health-check`, linked from the Nav and from a CTA card on the landing page. v1 is a deterministic rules engine (no live LLM call) — a real GenAI-backed version is a deliberate v2, deferred so the public-facing quiz doesn't carry per-use API cost, abuse/rate-limit exposure, or the optics of an audit-governance brand routing prospect answers through an unvetted third-party AI API before that's been thought through properly.
- **Bug fixes bundled into the same pass** (not design decisions, just fixing what's broken):
  1. Contact form inputs are effectively illegible — `globals.css` has zero styling for `input`/`select`/`textarea` (confirmed: no such selectors exist in the file), so they fall back to browser UA defaults, which render close-to-invisible against the dark `.contact` section background depending on OS/browser dark-mode theming.
  2. Header tagline ("AUDIT · ANALYTICS · AI", `.brand small` in `globals.css:34`) is `.62rem` at `var(--paper-text-soft)` (#93A6A9 on `--ink` #0C232B) — too small and too low-contrast to read comfortably at a glance.
  3. Any remaining trailing periods on single-sentence standalone labels/headings the previous copy sweep missed, found during this pass.

## Architecture changes

- New routes: `src/app/services/page.tsx`, `src/app/work/page.tsx`, `src/app/how-we-work/page.tsx`. Each is a plain server component composing its section(s) the same way `src/app/page.tsx` currently composes all twelve.
- `src/app/page.tsx` shrinks to: `Nav`, `Hero`, `Chooser`, `Coverage`, a new lightweight `ServicesTeaser` component, a new lightweight `WorkTeaser` component, `Contact`, `Footer`.
- `Nav.tsx` changes from same-page anchor links to real routes: `Services` → `/services`, `Selected work` → `/work`, plus new `How we work` → `/how-we-work` and `Health check` → `/health-check` links. `Start here` (`#start`) and `Book a conversation` (`#contact`) stay as home-page anchors when already on `/`, but need to become full links (`/#start`, `/#contact`) so they still work from a subpage. `Nav` is already used on every page (needs to be added to the three new page files plus `/health-check`, same as `Footer`).
- `Services.tsx` (full 6-card version) moves to render inside `/services/page.tsx` unchanged in content (minus ID codes, plus "we" voice). Each `.svc` card gets an `id` matching a slug (e.g. `id="ccm"`) so the home teaser can deep-link with `/services#ccm`.
- `Cases.tsx` (full 9-card version) moves to render inside `/work/page.tsx`, same treatment — drop `case-tag`, add per-card anchor ids for the home teaser's 3 links.
- `Positioning.tsx` (rewritten as founder bio), `Approach.tsx`, and `TechStrip.tsx` move to render inside `/how-we-work/page.tsx`.
- `StatBand.tsx` and its `useCountUp`-based `Stat` sub-component are deleted; `useCountUp` itself stays (still used by `Coverage`'s payoff counter).
- New `ServicesTeaser.tsx` and `WorkTeaser.tsx` components: small, no new hooks needed, follow the existing `Reveal`-wrapped section pattern. Teaser card content is a title + one-line summary pulled from the full versions, not full body copy.
- `sitemap.ts` gets four new entries for `/services`, `/work`, `/how-we-work`, `/health-check`.
- `IntentContext` / chooser → contact handoff is unaffected: `Chooser` and `EnquiryForm` both stay on `/`, so the existing same-page Context flow needs no changes. Subpage CTAs are plain links to `/#contact`, not chooser buttons, so they don't need to touch `IntentContext` at all.

## Copy changes

- Voice sweep to "we" across `Hero`, `Chooser`, `Coverage`, `Services`, `Cases`, `Approach` (and the new teaser components). `Positioning` becomes third-person: rewritten as a short founder bio for `/how-we-work` instead of first-person "I sit in the overlap..." — content (FCCA, MSc Data Science, 15 years, Big 4, production AI at a regulated asset manager) stays, framing changes to "Founded by Kiryl — ...".
- Hero headline/subhead get a sharper catchphrase + problem statement rewrite. I'll draft 2-3 options for the user to pick from rather than silently replacing the current headline — this is the single highest-visibility piece of copy on the site.
- Remove `case-tag` (`CCM-01` etc.) rendering from `Cases.tsx` entirely — the `cap` field (e.g. "Continuous monitoring") already covers the plain-word category and stays. Remove the `no` field (`"01 / CCM"` etc.) and its `<span className="no">` rendering from `Services.tsx` entirely too — titles are self-explanatory without a numeric/code prefix.
- Sweep for any remaining trailing periods on single-sentence standalone labels/headings across all touched files (same style rule as the prior copy-fix commit).

## Interactive health assessment

New route `src/app/health-check/page.tsx`, new client component `HealthCheckQuiz.tsx` — a multi-step wizard (one question per screen, matching the site's existing card-based visual language), followed by an email-capture step, followed by a results screen.

**Questions (all required, single-select except Q6):**

1. Industry — Banking / Asset management / Insurance / Other regulated FS / Non-FS
2. Audit team size — 1-5 / 6-15 / 16-50 / 50+
3. Current D&A maturity — None yet / Spreadsheets & BI / Some automation / Advanced
4. Analytics/AI budget appetite — Exploring only / Small pilot budget / Dedicated budget
5. Primary aim — Become D&A-savvy / Build GenAI capability / Move to continuous monitoring / Govern tools we own / Not sure
6. Biggest current pain point — free text, optional (stored verbatim, not scored)

**Scoring (deterministic, server-side):**

- **Recommendation:** Q5 maps directly 1:1 onto the existing `IntentKey` used by the chooser/`EnquiryForm` (`starting`, `genai`, `continuous`, `tools`, `exploring`) — same five options, same labels, so the result screen's CTA reuses `IntentContext` exactly like the chooser does, no new mapping table to maintain.
- **Maturity tier** (for the result screen's headline read-out, e.g. "Early stage" / "Building momentum" / "Scaling up"): a simple weighted sum of Q2 (team size), Q3 (maturity), Q4 (budget) — each answer worth 0-3 points, summed and bucketed into 3 tiers. Exact thresholds decided during implementation; not worth specifying to the point of pixel-pushing here.
- No LLM call in v1 (see decision above). The result copy is template text keyed by `(IntentKey, maturityTier)` — 5 × 3 = 15 short pre-written paragraphs, not generated per-request.

**Flow:** questions 1-6 → email capture step (name + email, same validation pattern as `EnquiryForm`, plus the existing honeypot pattern) → `POST /api/health-check` → result screen shows maturity tier + recommended service + one-line why + a "Book a conversation" button that sets `IntentContext` to the recommended key and links to `/#contact`.

**Data model:** new `public.health_check_responses` Supabase table (separate from `enquiries` — a quiz completion and a booking request are different visitor intents, and keeping them apart avoids forcing nullable quiz-only columns onto the existing well-scoped `enquiries` schema): `id`, `created_at`, `name`, `email`, `industry`, `team_size`, `maturity`, `budget`, `aim` (the resulting `IntentKey`), `pain_point` (nullable text), `maturity_tier`. RLS enabled, no public policies, service-role-only inserts — same posture as `enquiries`.

**API route:** `src/app/api/health-check/route.ts` — zod validation, the existing `checkRateLimit`/honeypot pattern reused verbatim from `/api/enquiry`, computes the recommendation + maturity tier server-side (never trust a client-submitted result), inserts into `health_check_responses`, then:
- Emails the visitor their result via a new `sendHealthCheckResult(input)` helper in `resend.ts` (same best-effort, silently-no-ops-without-`RESEND_API_KEY` pattern as `notifyNewEnquiry`).
- Also notifies the site owner via the existing `ENQUIRY_NOTIFY_EMAIL`, reusing `notifyNewEnquiry`'s pattern — a completed health check is a qualified lead worth seeing immediately, same as an enquiry.

**v2 (explicitly out of scope for this pass):** replacing the 15 template paragraphs with a live GenAI-generated summary. If pursued later, needs its own cost/abuse-rate-limit/vendor-disclosure design pass before wiring in a live API call on an unauthenticated public endpoint.

## Bug fixes

- **Contact form legibility:** add explicit styling for the form's `input`, `select`, `textarea` in `globals.css` (or scoped to `.contact form`) — background `var(--ink-2)`, text `var(--paper-text)`, a visible `1px solid var(--hair-ink)` border, and a focus state using `var(--assure-deep)` consistent with the existing focus-visible fix on `.chip-btn.active`.
- **Header tagline contrast:** bump `.brand small`'s font-size and/or swap `var(--paper-text-soft)` for a higher-contrast token against `--ink`. Needs an actual contrast-ratio check against WCAG AA (~4.5:1) once a replacement color is chosen, not just "looks better."

## Quality bar

Same as the original spec (`2026-08-15-krealsolutions-website-design.md` § Quality bar): TypeScript strict, ESLint clean, manual verification in a real browser, accessibility checks, Lighthouse ≥ 90 / ≥ 95. Manual browser QA for this round should specifically re-check: nav links resolve correctly from every page (not just home), teaser → subpage anchor deep-links land on the right card, contact form is now legible, the chooser → contact handoff still works unchanged, and the health-check quiz end-to-end (all 6 questions → email step → result screen → its own "Book a conversation" handoff correctly pre-selects the recommended intent).

Env vars: no new ones required for v1 (health-check reuses `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ENQUIRY_NOTIFY_EMAIL`).
