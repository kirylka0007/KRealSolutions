# K Real Solutions website — design

**Source of truth:** `BUILD-BRIEF.md` (requirements) + `index.html` (mockup — exact design/copy reference). This spec covers only the decisions the brief leaves open; everything else defers to the brief.

## Decisions confirmed with the client (user)

- **Deployment scope:** full setup now — create/push the real GitHub repo, create the real Supabase project + run the migration, connect the real Vercel project. `gh auth login` is interactive, so the user runs that one command themselves.
- **Repo:** existing public repo at `https://github.com/kirylka0007/KRealSolutions` (already has one commit, a README). Reuse it — do not create a new `krealsolutions-web` repo. Local working directory is already git-initialized with `origin` pointing here and the remote history merged in.
- **Contact email:** neither the domain nor the mailbox exist yet — `info@krealsolutions.co.uk` is a placeholder, same status as the domain below. Use it everywhere the mockup uses `hello@…` (contact section, mailto, footer), but flag it in the README as "swap once the domain + mailbox are live" rather than treating it as final.
- **Domain:** no real domain yet. Use a clearly-marked placeholder (`https://krealsolutions.co.uk` — matches the brand name) in canonical URL / Open Graph tags, noted in README as "replace when the domain is bought and DNS is ready."
- **Employer wording:** keep the mockup's anonymised phrasing ("large regulated financial-services firm" / "large regulated asset manager") verbatim — no further softening.
- **LinkedIn / phone in footer:** not provided — omit for now (brief lists this as optional, user-supplied later).

## Architecture

- Next.js 14 (App Router) + TypeScript, `src/` dir, ESLint, Prettier, pnpm (installed via corepack).
- Tailwind CSS. Mockup's exact hex values (`--ink`, `--paper`, `--assure`, `--exception`, etc.) become CSS variables in `globals.css`, referenced from `tailwind.config.ts` theme extensions — not re-guessed or approximated.
- Fonts via `next/font/google`: Archivo (500–900), IBM Plex Sans (400–600), IBM Plex Mono (400–600) — avoids the mockup's render-blocking Google Fonts `<link>` and prevents layout shift.
- Repo root is the Next.js project root (BUILD-BRIEF.md, index.html, and this spec already live there).

## Components

`src/components/sections/`: `Nav`, `Hero` (+ `LiveConsole`), `Chooser`, `StatBand` (+ `useCountUp`), `Coverage` (+ `DotGrid`), `Positioning`, `Services`, `Cases`, `TechStrip`, `Approach`, `Contact` (+ `EnquiryForm`), `Footer`.

Shared hooks in `src/hooks/`: `useReveal` (IntersectionObserver-based scroll reveal, replaces the mockup's global IO wiring), `useReducedMotion` (wraps `matchMedia('(prefers-reduced-motion: reduce)')`).

Section IDs must match the mockup exactly for in-page nav: `#top`, `#start`, `#problem`, `#coverage`, `#services`, `#work`, `#approach`, `#contact`.

## Chooser → Contact intent handoff

Brief allows either a shared store or a URL hash. Using a small React Context (`IntentContext`, provided at page root): clicking "Book it — free" in a `Chooser` panel sets the intent key (`genai` | `starting` | `tools` | `continuous` | `exploring`) in context, then smooth-scrolls to `#contact`. `EnquiryForm` reads the context value to pre-select its intent field. Simpler than parsing/writing a URL hash for a same-page flow; same observable result (this entry point is recorded on the submitted enquiry).

## Signature elements (reimplemented in React, matching the mockup's current behaviour 1:1)

1. **LiveConsole** — streaming feed of control checks, ~1-in-6 amber EXCEPTION, two live counters. `setInterval`-driven in a `useEffect`, cleaned up on unmount. `aria-hidden`. Static snapshot when `prefers-reduced-motion`.
2. **Count-up stats** — `useCountUp` hook triggered by `useReveal`'s IntersectionObserver at 50% threshold; snaps straight to target value under reduced motion.
3. **Coverage dot grids** — sparse 5%-sample grid (static, one missed exception in red) vs. continuous grid that animates fill to 100% on scroll (one exception caught in amber) + animated 53% payoff counter. Reduced motion renders the final state immediately.
4. **Mono control tags** on case cards (`CCM-01`, `GENAI-03`, …) — static, no animation needed.

## Enquiry form + Supabase

- `POST /api/enquiry` route handler (server-only).
- Validation: zod schema — `name` (optional string), `email` (required, valid email), `organisation` (optional), `role` (optional), `intent` (optional enum of the 5 keys), `message` (optional string), plus a hidden honeypot field that silently no-ops the request (returns success without inserting) if filled.
- Rate limiting: in-memory `Map<ip, timestamp[]>` throttle (e.g. max 5 submissions per IP per 10 minutes). Acceptable for a low-traffic marketing site; resets on redeploy/cold start, which is fine — this is spam friction, not a security boundary.
- Insert via `@supabase/supabase-js` server client constructed with `SUPABASE_SERVICE_ROLE_KEY` (server-only env var, never `NEXT_PUBLIC_`), called only from the route handler.
- Optional Resend notification to `ENQUIRY_NOTIFY_EMAIL` if `RESEND_API_KEY` is set; skipped silently otherwise.
- Client: controlled inputs, inline success/error state in the site's voice, no `<form>`-less hacks.

### Supabase migration

Exactly as specified in `BUILD-BRIEF.md` §5 — `public.enquiries` table, RLS enabled, no public policies, service-role-only inserts. Created via the Supabase MCP tools against a real new project (full-setup path).

## Env vars

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=            # optional
ENQUIRY_NOTIFY_EMAIL=info@krealsolutions.co.uk
```

Documented in `.env.example`; real values set in Vercel → Settings → Environment Variables (Production + Preview) — never committed.

## Deployment

1. `pnpm` install via corepack; `gh` CLI installed via `winget install --id GitHub.cli`.
2. User runs `gh auth login` interactively (handed off, not automatable).
3. Push scaffolded app to `origin main` on the existing `kirylka0007/KRealSolutions` repo.
4. Create Supabase project + run migration via Supabase MCP tools; pull URL/service-role key.
5. Import the repo into Vercel via Vercel MCP tools; set env vars; confirm production deploy from `main` + preview deploys on PRs.
6. README documents local dev, env vars, and the DNS records to add once `krealsolutions.co.uk` (or the real domain) is confirmed.

## Quality bar

- TypeScript strict, ESLint clean.
- Manual verification in a real browser (dev server): golden-path enquiry submission, chooser → intent → form prefill, mobile nav at both breakpoints (~940px, ~640px), `prefers-reduced-motion` (counters snap, console static, grids final-state, no looping animation).
- Accessibility: visible keyboard focus, labelled form fields, real `<button>` elements, keyboard-navigable chooser tabs, `LiveConsole` `aria-hidden`.
- Lighthouse pass (via chrome-devtools MCP) targeting performance ≥ 90, accessibility ≥ 95.
- Metadata: Open Graph tags, favicon, `sitemap.ts`, `robots.ts`.
- No unit-test framework — not requested by the brief; would be over-engineering for a single-form marketing site. Correctness is verified by TypeScript + manual browser testing per above.

## Out of scope (explicitly, per brief §1)

No CMS, no auth, no user accounts, no additional pages beyond the single landing page. Employer is never named.
