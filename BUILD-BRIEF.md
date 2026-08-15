# Build brief — K Real Solutions website

**For:** Claude Code
**Goal:** Turn the attached static mockup (`index.html`) into a production website in JavaScript, in GitHub, deployed on Vercel, with a Supabase-backed enquiry form for lead capture.

> **Attach `index.html` to the Claude Code session.** It is the single source of truth for design and copy. Reproduce its look and content exactly; only re-architect the code and add the enquiry form + deployment.

---

## 1. Stack (decided — don't re-litigate)

- **Framework:** Next.js (App Router) + **TypeScript**
- **Styling:** Tailwind CSS, with the mockup's design tokens defined as CSS variables / Tailwind theme extensions
- **Animation:** `framer-motion` for scroll reveals; small custom hooks for the count-up and the live console (plain `IntersectionObserver` is an acceptable alternative — keep the bundle light)
- **Fonts:** `next/font/google` — Archivo (500–900), IBM Plex Sans (400–600), IBM Plex Mono (400–600)
- **Data (only where needed):** Supabase (Postgres) for enquiry submissions
- **Email (optional):** Resend, to notify me of new enquiries
- **Hosting:** Vercel, auto-deploy from GitHub
- **Package manager:** pnpm

Keep it a single app. No CMS, no auth, no user accounts — this is a marketing site with one form.

---

## 2. Repo & tooling

1. Scaffold `create-next-app` (App Router, TypeScript, Tailwind, ESLint, `src/` dir).
2. Init git, create a **private GitHub repo** `krealsolutions-web` (use `gh` CLI), push `main`.
3. Add `.env.example`, `.gitignore` (Next defaults + `.env*`), Prettier, and a short `README.md` with local-dev + deploy steps.
4. Conventional commits; small, reviewable commits per section.

---

## 3. Design tokens (from the mockup — use these exact values)

```
Colors
--ink #0C232B   --ink-2 #123039   --ink-3 #15373f
--paper #EEF1F0   --paper-2 #E4E9E8
--text #12242B   --text-soft #4D5F65
--paper-text #DDE6E5   --paper-text-soft #93A6A9
--assure #12A594   --assure-deep #0E7E72   --assure-bright #19C9B4
--exception #E8A317   --exception-red #D8552E
hairlines: rgba(18,36,43,.14) on light, rgba(221,230,229,.16) on dark

Type
Display: Archivo (headings, big numbers) — tight tracking (-0.02em), weights 800/900 for hero + stats
Body: IBM Plex Sans
Utility/labels/tags/counters: IBM Plex Mono (uppercase, letter-spaced)

Signature elements (preserve these — they are the point of the design)
1. Hero "live monitoring console": streaming feed of control checks (mostly green PASS, ~1 in 6 amber EXCEPTION) + two live counters ("controls evaluated today", "exceptions auto-flagged")
2. Count-up stats that animate when scrolled into view
3. "Coverage" section: two 100-cell dot grids — a sparse sample (with one missed exception in red) vs a continuous grid that fills to 100% on scroll (one exception caught in amber) + a 53% payoff counter
4. Mono "control tags" on case studies (CCM-01, GENAI-03, …)
```

---

## 4. Page structure (single landing page, these sections in order)

Componentise each section under `src/components/sections/`. IDs must match for in-page nav.

1. `Nav` — sticky, blurred dark bar. Links: **Start here** (`#start`), **Services** (`#services`), **Selected work** (`#work`), **Book a conversation** (CTA → `#contact`). Mobile hamburger.
2. `Hero` (`#top`) — positioning headline + lede + CTAs + credibility row; right side = **LiveConsole** widget.
3. `Chooser` (`#start`) — "What do you want to solve?" 5 tab buttons → tailored panels, each ending in a free-offer CTA. (Content in mockup.) See §6 for the enhancement.
4. `StatBand` (`#problem`) — 4 count-up stats (ACFE figures, keep the source labels).
5. `Coverage` (`#coverage`) — the two dot grids + 53% payoff counter.
6. `Positioning` — the "auditor who can build" strip.
7. `Services` (`#services`) — 6 lines: 4 in a 2×2 grid, then 2 full-width advisory cards (EUC, Risk Intelligence).
8. `Cases` (`#work`) — 9 case cards (dark) + "Further work" strip.
9. `TechStrip`, `Approach`.
10. `Contact` (`#contact`) — free-offers trio + **enquiry form** (see §5, replaces the mailto).
11. `Footer`.

All copy comes verbatim from the mockup. **Do not name the former employer** — keep the anonymised "large regulated financial-services firm" phrasing.

---

## 5. Enquiry form + Supabase (the only dynamic part)

Replace the hero/contact mailto with a real form.

**Fields:** name, email (required), organisation, role (optional), `intent` (which "what do you want to solve?" option — see §6), message. Include a hidden **honeypot** field for spam.

**Flow:** client form → `POST /api/enquiry` (route handler) → validate (zod) → insert into Supabase → optional Resend notification → return success. Show inline success/error states in the interface's own voice; no `<form>`-less hacks, standard controlled inputs.

**Supabase table** (`supabase/migrations/…sql`):

```sql
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text not null,
  organisation text,
  role text,
  intent text,            -- 'genai' | 'starting' | 'tools' | 'continuous' | 'exploring' | null
  message text,
  source text not null default 'website'
);
alter table public.enquiries enable row level security;
-- No public policies. Inserts happen server-side with the service role key only.
```

**Security:** insert from the **route handler using the Supabase service-role key** (server-only env var — never expose it, never `NEXT_PUBLIC_`). Validate and rate-limit (simple IP/time throttle is fine). No public read.

**Env vars** (`.env.example` + Vercel project settings):

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=            # optional
ENQUIRY_NOTIFY_EMAIL=      # where new-enquiry alerts go (optional)
```

You may use the Supabase MCP/CLI to create the project, run the migration, and pull the keys.

---

## 6. Chooser → form enhancement

When a user clicks **"Book it — free"** in a chooser panel, carry that panel's intent to the contact form: smooth-scroll to `#contact` and pre-select the matching `intent` value (e.g. via a shared state/store or a URL hash like `#contact?intent=genai`). This tells me which entry point drove each enquiry.

Intent keys: `genai`, `starting`, `tools`, `continuous`, `exploring`.

---

## 7. Behaviour & quality bar

- Fully **responsive** (mockup breakpoints ~940px and ~640px); mobile nav works.
- **`prefers-reduced-motion`**: counters snap to final values; console shows a static snapshot; grids render final state; no looping motion. (The mockup already does this — mirror it.)
- Accessible: visible keyboard focus, labelled form fields, buttons are real `<button>`s, chooser tabs keyboard-navigable, live console `aria-hidden`.
- Lighthouse: performance ≥ 90, accessibility ≥ 95. Metadata + Open Graph tags + favicon. `sitemap.ts` + `robots.ts`.
- No layout shift from font loading (`next/font`).

---

## 8. Deployment (Vercel + GitHub)

1. Push to GitHub `main`.
2. Import the repo in Vercel (framework auto-detected as Next.js).
3. Add all env vars in Vercel → Settings → Environment Variables (Production + Preview).
4. Confirm: push to `main` → production deploy; PRs → preview deploys.
5. Custom domain: add `krealsolutions.co.uk` (or the real domain) when DNS is ready — leave a note in the README on the records to set.

---

## 9. Placeholders to leave clearly marked (I'll fill these)

- Contact email / domain (mockup uses `hello@krealsolutions.co.uk` — confirm or replace)
- Real domain for canonical URL + OG tags
- Whether to soften "large regulated asset manager" wording
- LinkedIn / phone if I want them in the footer

---

## 10. Acceptance checklist

- [ ] Design matches the mockup (tokens, fonts, all four signature elements working)
- [ ] All sections present with correct IDs and copy; employer not named
- [ ] Chooser tabs switch; "Book it — free" carries intent to the form
- [ ] Enquiry form validates, inserts to Supabase, shows success/error, honeypot works
- [ ] (If enabled) Resend notification arrives
- [ ] Reduced-motion + mobile + a11y all pass
- [ ] Live on Vercel from GitHub `main`; preview deploys on PRs
- [ ] README covers local dev, env vars, and deploy

---

## Kickoff prompt (paste into Claude Code with `index.html` attached)

> Build a production Next.js (App Router, TypeScript) marketing site from the attached `index.html` mockup, following `BUILD-BRIEF.md`. Reproduce the design and copy exactly using Tailwind with the tokens in the brief; re-implement the interactions (live console, count-up stats, coverage animation, chooser tabs, mobile nav) in React with `prefers-reduced-motion` respected. Add a Supabase-backed enquiry form that captures the chooser "intent", inserting server-side via the service-role key. Scaffold the repo, commit in small steps, push to a new private GitHub repo, and set it up for Vercel deployment. Start by proposing the file/component structure and the Supabase migration, then build section by section.
