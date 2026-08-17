# Site Restructure & Health-Check Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the K Real Solutions site from one long single page into a home page plus three subpages (`/services`, `/work`, `/how-we-work`), switch copy voice from "I" to "we", drop internal ID-code kickers, fix three review-found bugs, and add a new interactive `/health-check` lead-gen quiz.

**Architecture:** Existing section components stay in `src/components/sections/` but move which page renders them: `Services`/`Cases`/`Positioning`/`Approach`/`TechStrip` move off the home page onto their own routes, and the home page gets two new lightweight teaser components (`ServicesTeaser`, `WorkTeaser`) that link into them. `Nav` and `Footer` become shared across every page via real routes instead of same-page anchors. The health-check quiz is a new self-contained feature: a client-side wizard component, a deterministic (non-LLM) scoring module, a new Supabase table, and an API route that mirrors the existing `/api/enquiry` route's validation/rate-limit/honeypot pattern exactly.

**Tech Stack:** Next.js 16 (App Router, TS), Tailwind CSS / hand-authored `globals.css` (existing pattern — new UI follows suit, not Tailwind utility classes), `next/link`, zod, `@supabase/supabase-js`, Resend, pnpm.

**Spec:** `docs/superpowers/specs/2026-08-17-site-restructure-design.md` (this plan implements it in full; read both — the spec has the decisions and rationale, this plan has the exact file-by-file execution).

## Global Constraints

- No automated test suite in this repo (TypeScript + manual browser QA only, per the original spec's Quality bar). Tasks below specify manual verification steps, not test-writing steps.
- Voice: "we" throughout all service/case/process copy. The founder-bio section (`Positioning.tsx`) is third-person ("K Real Solutions was founded by Kiryl...", not "I sit in the overlap...").
- No trailing periods on single-sentence standalone labels/headings, category tags, quiz answer options, or CTA/button text. Multi-sentence body paragraphs keep normal punctuation. Em dashes stay as en dashes (` – `, U+2013) everywhere, matching the existing site-wide convention already in the codebase — do not introduce new em dashes (U+2014) in any new copy.
- Drop all `CCM-01`/`GENAI-03`/`PM-01`-style ID-code kickers from service and case cards, everywhere, no exceptions.
- `SUPABASE_SERVICE_ROLE_KEY` stays server-only — never `NEXT_PUBLIC_`, never referenced from a Client Component. The health-check API route follows the exact same posture as `/api/enquiry`.
- The user's laptop has very limited RAM (~7.8GB total, often ~1GB free) and live browser-automation QA has crashed it twice already this session. **No task in this plan should assume a subagent will drive automated Chrome/Playwright tooling.** Where manual browser verification is needed, the task should note that the user can do it themselves (dev server on port 3002 + their own already-open browser, sharing screenshots back) rather than an agent launching its own Chrome instance.
- Package manager: pnpm. Existing Supabase project ref `hpemolpqyghkmzawywlm` — real credentials already exist in `.env.local` from the original build (Task 18 of the prior plan). Do not create a new Supabase project.

---

## File Structure

```
src/
  app/
    page.tsx                     # MODIFIED — trimmed home composition
    globals.css                  # MODIFIED — new styles, StatBand styles removed
    sitemap.ts                   # MODIFIED — 4 new routes
    services/
      page.tsx                   # NEW
    work/
      page.tsx                   # NEW
    how-we-work/
      page.tsx                   # NEW
    health-check/
      page.tsx                   # NEW
    api/
      health-check/
        route.ts                 # NEW — mirrors /api/enquiry
  components/
    Reveal.tsx                    # MODIFIED — forwards optional `id` prop
    sections/
      Nav.tsx                     # MODIFIED — real routes via next/link
      Footer.tsx                  # MODIFIED — footer nav links
      Hero.tsx                    # MODIFIED — we-voice, approved headline
      Chooser.tsx                 # MODIFIED — we-voice
      Coverage.tsx                # MODIFIED — we-voice
      StatBand.tsx                 # DELETED
      Services.tsx                # MODIFIED — we-voice, drop ID codes, anchor ids
      ServicesTeaser.tsx          # NEW
      Cases.tsx                   # MODIFIED — drop ID codes, anchor ids
      WorkTeaser.tsx               # NEW
      Positioning.tsx             # MODIFIED — rewritten as third-person founder bio
      Approach.tsx                 # MODIFIED — we-voice
      TechStrip.tsx                 # unchanged content, relocated to /how-we-work
      Contact.tsx                  # MODIFIED — health-check freebar card links out
      EnquiryForm.tsx               # MODIFIED — `enquiry-form` class for styling hook
      HealthCheckQuiz.tsx          # NEW
  hooks/                           # unchanged
  context/                         # unchanged
  types/
    intent.ts                     # MODIFIED — exports shared INTENT_LABELS
    health-check.ts               # NEW
  lib/
    health-check-schema.ts        # NEW
    health-check-scoring.ts       # NEW
    resend.ts                     # MODIFIED — adds sendHealthCheckResult
supabase/
  migrations/
    20260817120000_create_health_check_responses.sql   # NEW
```

---

### Task 1: Nav, Footer, and sitemap become route-aware

**Files:**
- Modify: `src/components/sections/Nav.tsx`
- Modify: `src/components/sections/Footer.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Produces: `Nav` and `Footer` with real `next/link` routes (`/services`, `/work`, `/how-we-work`, `/health-check`, `/#start`, `/#top`, `/#contact`) — every later task that creates a new page imports these two components unchanged from here on.

- [ ] **Step 1: Rewrite `Nav.tsx` to use `next/link` and real routes**

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <Link href="/#top" className="brand">
          <span className="dot" />K&nbsp;REAL&nbsp;SOLUTIONS{" "}
          <small>Audit&nbsp;·&nbsp;Analytics&nbsp;·&nbsp;AI</small>
        </Link>
        <button
          className="burger"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="navlinks"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-links${open ? " open" : ""}`} id="navlinks">
          <Link href="/#start" onClick={() => setOpen(false)}>
            Start here
          </Link>
          <Link href="/services" onClick={() => setOpen(false)}>
            Services
          </Link>
          <Link href="/work" onClick={() => setOpen(false)}>
            Work
          </Link>
          <Link href="/health-check" onClick={() => setOpen(false)}>
            Health check
          </Link>
          <Link href="/#contact" className="nav-cta" onClick={() => setOpen(false)}>
            Book a conversation
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

Note: `How we work` is deliberately left out of the primary nav (5 items plus the CTA is already a lot for the ~940px breakpoint) — it's reachable from the footer (Step 2) and from links within `/services` and `/work`.

- [ ] **Step 2: Rewrite `Footer.tsx` with a links row**

```tsx
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap">
        <span className="brand">
          <span className="dot" /> K Real Solutions Ltd
        </span>
        <nav className="footer-links">
          <Link href="/services">Services</Link>
          <Link href="/work">Work</Link>
          <Link href="/how-we-work">How we work</Link>
          <Link href="/health-check">Health check</Link>
        </nav>
        <span>Internal audit · data analytics · AI &nbsp;·&nbsp; Registered in Scotland</span>
        <span>© {year} K Real Solutions Ltd</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Add `.footer-links` styling to `globals.css`**

Add immediately after the existing `footer .brand .dot{...}` rule (`globals.css:233`):

```css
.footer-links{display:flex;gap:18px;flex-wrap:wrap}
.footer-links a{color:var(--paper-text-soft);transition:color .2s}
.footer-links a:hover{color:var(--paper-text)}
```

- [ ] **Step 4: Update `sitemap.ts` with the four new routes**

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://krealsolutions.co.uk"; // PLACEHOLDER — replace once domain is live
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/how-we-work`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/health-check`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
```

- [ ] **Step 5: Verify it builds and the nav renders**

Run: `pnpm exec tsc --noEmit` — expect no errors (the four new routes don't exist as pages yet, but `Link href` to a nonexistent route is not a type error in Next.js — it resolves at request time, not compile time).

Run `pnpm dev -p 3002` briefly and load `http://localhost:3002` yourself (or ask the user to) to confirm the nav renders with the new links and doesn't visually overflow at desktop width; the four new links will 404 until later tasks build those pages — that's expected at this checkpoint.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Nav.tsx src/components/sections/Footer.tsx src/app/globals.css src/app/sitemap.ts
git commit -m "feat: route Nav/Footer to real pages ahead of site restructure"
```

---

### Task 2: Cut StatBand, "we"-voice sweep for Hero, Chooser, Coverage

**Files:**
- Delete: `src/components/sections/StatBand.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/Chooser.tsx`
- Modify: `src/components/sections/Coverage.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: home page's `<StatBand />` usage removed; `Hero`, `Chooser`, `Coverage` still export the same component names/props (no signature change) — later tasks touching `page.tsx` build on this trimmed composition.

- [ ] **Step 1: Delete `StatBand.tsx`**

```bash
git rm src/components/sections/StatBand.tsx
```

- [ ] **Step 2: Remove its usage from `page.tsx`**

Remove the `import { StatBand } from "@/components/sections/StatBand";` line and the `<StatBand />` line from the JSX. `page.tsx` after this step:

```tsx
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Chooser } from "@/components/sections/Chooser";
import { Coverage } from "@/components/sections/Coverage";
import { Positioning } from "@/components/sections/Positioning";
import { Services } from "@/components/sections/Services";
import { Cases } from "@/components/sections/Cases";
import { TechStrip } from "@/components/sections/TechStrip";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Chooser />
      <Coverage />
      <Positioning />
      <Services />
      <Cases />
      <TechStrip />
      <Approach />
      <Contact />
      <Footer />
    </>
  );
}
```

(`Positioning`, `Services`, `Cases`, `TechStrip`, `Approach` are removed from here in Tasks 3-5 once their new homes and teasers exist — leaving them for now keeps the app fully working at this checkpoint.)

- [ ] **Step 3: Remove StatBand's now-dead CSS from `globals.css`**

Delete these blocks (the `/* STAT BAND */` comment through the last `.stat-src` rule, `globals.css:90-101`):

```css
/* STAT BAND */
.band{background:var(--ink);color:var(--paper-text);position:relative;overflow:hidden}
.band::before{content:"";position:absolute;inset:0;background:radial-gradient(90% 120% at 10% 100%,rgba(232,163,23,.12),transparent 50%);pointer-events:none}
.band .wrap{position:relative;z-index:1;padding:90px 28px}
.band .sec-head h2{color:#fff}
.band .sec-head p{color:var(--paper-text-soft)}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--hair-ink);margin-top:56px;border:1px solid var(--hair-ink);border-radius:14px;overflow:hidden}
.stat{background:var(--ink);padding:34px 26px;transition:background .3s}
.stat:hover{background:var(--ink-2)}
.stat-num{font-family:var(--font-archivo),sans-serif;font-weight:900;font-size:clamp(2.6rem,4.6vw,3.6rem);color:var(--exception);letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
.stat-desc{font-size:.98rem;color:var(--paper-text);margin-top:14px;max-width:24ch}
.stat-src{font-family:var(--font-plex-mono),monospace;font-size:.62rem;letter-spacing:.06em;color:var(--paper-text-soft);margin-top:12px;text-transform:uppercase}
```

Also remove `.stat-grid` from the `@media(max-width:560px)` rule at the bottom (`globals.css:255`), changing:

```css
.stat-grid,.case-grid,.appr-grid{grid-template-columns:1fr}
```

to:

```css
.case-grid,.appr-grid{grid-template-columns:1fr}
```

`useCountUp` (the hook `StatBand` used) stays — `Coverage`'s payoff counter still uses it.

- [ ] **Step 4: "We"-voice edit for `Hero.tsx`, using the approved headline**

```tsx
import { Reveal } from "@/components/Reveal";
import { LiveConsole } from "./LiveConsole";

export function Hero() {
  return (
    <header className="hero on-ink" id="top">
      <div className="wrap hero-in">
        <Reveal className="in">
          <span className="eyebrow">Continuous assurance · GenAI · Analytics</span>
          <h1>
            From sample-based testing to{" "}
            <span className="em">continuous, AI-driven assurance</span>
          </h1>
          <p className="lede">
            We help internal audit and assurance teams in regulated financial services replace
            manual, point-in-time testing with continuous, AI-augmented assurance – built by a
            team that combines audit qualification with data science.
          </p>
          <div className="hero-cta">
            <a href="/#contact" className="btn btn-primary">
              Book a conversation <span className="arrow">→</span>
            </a>
            <a href="/work" className="btn btn-ghost">
              See the work
            </a>
          </div>
          <div className="creds">
            <span>FCCA qualified</span>
            <span>MSc Data Science (Distinction)</span>
            <span>15+ yrs financial services &amp; Big 4</span>
            <span>Production AI in a regulated asset manager</span>
          </div>
        </Reveal>
        <LiveConsole />
      </div>
    </header>
  );
}
```

Note the `See the work` CTA now points to `/work` (was `#work`, a same-page anchor that no longer exists on the home page after Task 4).

- [ ] **Step 5: "We"-voice edit for `Chooser.tsx`**

Only the copy changes (structure, state, and the intent-handoff logic are untouched — do not modify `handleBookIt`, `useIntent`, or the `PANELS` array's `key`/`ix` fields). Replace every first-person string in the `PANELS` array and the section header:

```tsx
"use client";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useIntent } from "@/context/IntentContext";
import type { IntentKey } from "@/types/intent";

type Panel = {
  key: IntentKey;
  ix: string;
  label: string;
  heading: string;
  desc: string;
  rel: React.ReactNode;
  offerTitle: string;
  offerDesc: string;
};

const PANELS: Panel[] = [
  {
    key: "genai",
    ix: "01",
    label: "Get value from GenAI in audit",
    heading: "You know GenAI could help audit. You need it to actually land – safely.",
    desc: "We find the highest-value uses across your audit lifecycle – document and policy review, fraud indicators, risk assessment, QA and reporting – and build them to run in a regulated environment, with a human in the loop.",
    rel: (
      <>
        Where we&apos;d start: <a href="/services#genai">GenAI for Internal Audit</a>
        <br />
        Proof: bulk document analysis · fake-receipt detection · automated briefings
      </>
    ),
    offerTitle: "GenAI-in-audit health check",
    offerDesc: "A working session mapping where GenAI would pay off first in your function",
  },
  {
    key: "starting",
    ix: "02",
    label: "Start our data-analytics journey",
    heading: "Your team is ready to start with analytics – but not sure where.",
    desc: "We help audit teams take the first steps: quick wins that build confidence, a practical roadmap, and hands-on training so the capability stays with your people, not with a contractor.",
    rel: (
      <>
        Where we&apos;d start: <a href="/services#auto">Audit &amp; Analytics Automation</a> ·{" "}
        <a href="/services#ccm">Continuous Assurance foundations</a>
        <br />
        Plus: training &amp; upskilling built into the engagement
      </>
    ),
    offerTitle: "Intro session for your IA team",
    offerDesc: "A no-pitch conversation with your auditors, plus a starter roadmap for where to begin",
  },
  {
    key: "tools",
    ix: "03",
    label: "Get more from tools we own",
    heading: "You've bought Alteryx, Power BI and Power Automate. Are they earning their keep?",
    desc: "We review what's already been built – for value, control weaknesses and key-person risk – govern the self-service estate, and unlock the use cases the licences were bought for in the first place.",
    rel: (
      <>
        Where we&apos;d start: <a href="/services#euc">Self-Service Analytics Assurance</a> ·{" "}
        <a href="/services#auto">Audit &amp; Analytics Automation</a>
        <br />
        Context: 88% of business spreadsheets contain errors (Panko / EuSpRIG)
      </>
    ),
    offerTitle: "Analytics-estate health check",
    offerDesc: "A review of what you've built and where the value – and the risk – is hiding",
  },
  {
    key: "continuous",
    ix: "04",
    label: "Move to continuous assurance",
    heading: "Point-in-time testing is leaving gaps. You want always-on coverage.",
    desc: "We design and build continuous controls monitoring – data feeds blended and scored, exceptions flagged and routed to the right auditor automatically – so you move from a sample to the full population.",
    rel: (
      <>
        Where we&apos;d start: <a href="/services#ccm">Continuous Assurance &amp; Controls Monitoring</a>
        <br />
        Proof: continuous monitoring platform · unstructured email into a tested control
      </>
    ),
    offerTitle: "Continuous-assurance scoping call",
    offerDesc: "We pick one control and map exactly what always-on coverage would take",
  },
  {
    key: "exploring",
    ix: "05",
    label: "Not sure yet",
    heading: "Not sure what you need? That's a perfectly good place to start.",
    desc: "A short, no-obligation conversation about your controls, your data and your team. We'll tell you honestly where analytics and AI would move the needle – and, just as usefully, where they wouldn't.",
    rel: (
      <>
        We can look across any of it: <a href="/services">the full range of services</a>
      </>
    ),
    offerTitle: "Initial conversation",
    offerDesc: "Fifteen minutes to work out whether there's a fit. No slides, no pressure",
  },
];

export function Chooser() {
  const [active, setActive] = useState<IntentKey>("genai");
  const { setIntent } = useIntent();

  function handleBookIt(key: IntentKey) {
    setIntent(key);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="sec start" id="start">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Start here</span>
          <h2>What do you want to solve?</h2>
          <p>Pick the one that sounds most like you – we&apos;ll show you where we&apos;d start, and a no-cost way in.</p>
        </Reveal>
        <Reveal as="div" className="chooser">
          <div className="chooser-btns" role="tablist">
            {PANELS.map((p) => (
              <button
                key={p.key}
                className={`chip-btn${active === p.key ? " active" : ""}`}
                role="tab"
                aria-selected={active === p.key}
                onClick={() => setActive(p.key)}
              >
                <span className="ix">{p.ix}</span> {p.label}
              </button>
            ))}
          </div>
          <div className="panel-wrap">
            {PANELS.map((p) => (
              <div key={p.key} className={`panel${active === p.key ? " active" : ""}`} id={`p-${p.key}`}>
                <div>
                  <h3>{p.heading}</h3>
                  <p className="desc">{p.desc}</p>
                  <div className="rel">{p.rel}</div>
                </div>
                <div className="offer">
                  <span className="free">Free to start</span>
                  <h4>{p.offerTitle}</h4>
                  <p>{p.offerDesc}</p>
                  <button className="btn btn-primary" onClick={() => handleBookIt(p.key)}>
                    Book it – free <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

Note `p.offerDesc` values dropped their trailing periods (short standalone label under a heading, per the style rule) and the `rel` links now point at the new `/services#<id>` anchors that Task 3 creates — `#genai`/`#auto`/`#ccm`/`#euc` match the `id`s `Services.tsx` will get in Task 3.

- [ ] **Step 6: "We"-voice edit for `Coverage.tsx`**

Only the copy strings change (hooks/state untouched):

```tsx
"use client";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useReveal } from "@/hooks/useReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { DotGridPast, DotGridNow } from "./DotGrid";

export function Coverage() {
  const [nowPct, setNowPct] = useState(0);
  const { ref: payoffRef, revealed: payoffRevealed } = useReveal<HTMLDivElement>();
  const payoffText = useCountUp(payoffRevealed, 53, { suffix: "%" });

  return (
    <section className="sec cov" id="coverage">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">The shift</span>
          <h2>From a 5% sample to 100% monitored</h2>
          <p>Continuous assurance doesn&apos;t test harder – it tests everything, all the time, and sends only the exceptions to a human. Same team, complete coverage.</p>
        </Reveal>

        <div className="cov-grid2">
          <Reveal as="div" className="cov-card past">
            <div className="cov-top">
              <span className="cov-kicker">Point-in-time sample</span>
              <span className="cov-pct">5%</span>
            </div>
            <DotGridPast />
            <div className="cov-note bad">
              <span className="tick">✕</span> One exception sat outside the sample – and was missed
            </div>
          </Reveal>
          <Reveal as="div" className="cov-card now">
            <div className="cov-top">
              <span className="cov-kicker">Continuous monitoring</span>
              <span className="cov-pct">{nowPct}%</span>
            </div>
            <DotGridNow onPctChange={setNowPct} />
            <div className="cov-note good">
              <span className="tick">✓</span> Every item checked. The same exception is caught and flagged.
            </div>
          </Reveal>
        </div>

        <div ref={payoffRef} className={`cov-payoff reveal${payoffRevealed ? " in" : ""}`}>
          <div className="big">{payoffText}</div>
          <div>
            <div className="txt">lower fraud losses at organisations that use proactive data analytics as a control, versus those that don&apos;t</div>
            <div className="src">ACFE · Report to the Nations 2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

(Coverage had no first-person pronouns to begin with — this step is a no-op confirmation, not a rewrite. Verify by re-reading the file; do not introduce changes for their own sake.)

- [ ] **Step 7: Verify**

Run `pnpm exec tsc --noEmit` — expect no errors. `pnpm lint` — expect no new errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: cut StatBand, switch Hero/Chooser copy to we-voice"
```

---

### Task 3: Services page + home teaser

**Files:**
- Modify: `src/components/Reveal.tsx`
- Modify: `src/components/sections/Services.tsx`
- Create: `src/components/sections/ServicesTeaser.tsx`
- Create: `src/app/services/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `Reveal` now accepts an optional `id?: string` prop, forwarded to the rendered element — Task 4 relies on this too.
- Produces: `ServicesTeaser` (no props) — used only by `src/app/page.tsx`.

- [ ] **Step 1: Add an `id` pass-through to `Reveal.tsx`**

```tsx
"use client";
import { useReveal } from "@/hooks/useReveal";
import type { ElementType, ReactNode } from "react";

export function Reveal({
  as: Tag = "div",
  className = "",
  children,
  ariaHidden,
  id,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  ariaHidden?: boolean;
  id?: string;
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal${revealed ? " in" : ""} ${className}`.trim()}
      aria-hidden={ariaHidden}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Rewrite `Services.tsx` — drop ID codes, we-voice, add anchor ids**

```tsx
import { Reveal } from "@/components/Reveal";

const SERVICES = [
  { id: "ccm", title: "Continuous Assurance & Controls Monitoring", body: "We design and build always-on control monitoring: data feeds from your source systems, blended and scored, with exception logic that surfaces breaches automatically and routes them to the right auditor – moving you from periodic samples to full-population coverage.", tags: ["Microsoft Fabric", "Power BI", "Dataflows", "Power Automate"] },
  { id: "genai", title: "GenAI for Internal Audit", body: "Practical, governed LLM and vision AI across the audit lifecycle – document and policy review, risk assessment, fraud indicators, QA and reporting. We deploy it safely for regulated environments, with a human in the loop by design.", tags: ["Azure OpenAI", "Databricks", "RAG", "Vision"] },
  { id: "auto", title: "Audit & Analytics Automation", body: "We automate the audit operating model – follow-ups, request management, incident summarisation and reporting – so your team spends its time on judgement, not admin. Built on the Microsoft and Alteryx stack you already run.", tags: ["Power Automate", "Alteryx", "Python", "SharePoint"] },
  { id: "pm", title: "Process Mining & Process Intelligence", body: "We reconstruct how a process actually runs from its event data – not how the flowchart says it does. Expose variants, rework loops and control gaps, and quantify the case for change with evidence, not anecdote.", tags: ["PM4Py", "Process Mining", "Event logs"] },
];

export function Services() {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">What we do</span>
          <h2>Four delivery lines, two advisory lines</h2>
          <p>Capabilities that modernise your assurance – plus two advisory lines that govern the tools you already have and turn stakeholder engagement into risk intelligence. Every engagement includes knowledge transfer, so your team owns what we deliver.</p>
        </Reveal>
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <Reveal as="article" className="svc" id={s.id} key={s.id}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </Reveal>
          ))}

          <Reveal as="article" className="svc svc--wide" id="euc">
            <div className="svc-wide-main">
              <h3>Self-Service Analytics Assurance</h3>
              <p>
                Business-built Alteryx workflows, Power Automate flows, Power BI models and Python scripts now run critical processes – usually outside any formal development lifecycle. We review the estate for logic errors, hidden control weaknesses, key-person risk and missing documentation, and put the governance in place to keep it audit-ready. Assurance <em>over</em> the tools, not just building with them.
              </p>
              <div className="svc-stat">
                <b>88%</b> of business spreadsheets contain errors – that&apos;s the estate you&apos;re not testing. <span style={{ opacity: 0.6 }}>Panko / EuSpRIG</span>
              </div>
            </div>
            <div className="svc-wide-side">
              <div className="tags">
                <span>Alteryx review</span>
                <span>Power Automate review</span>
                <span>Python</span>
                <span>EUC governance</span>
                <span>Data lineage</span>
              </div>
            </div>
          </Reveal>

          <Reveal as="article" className="svc svc--wide" id="risk-intel">
            <div className="svc-wide-main">
              <h3>Stakeholder &amp; Risk Intelligence</h3>
              <p>
                Audit teams meet the business on a schedule – but those meetings are often run ad hoc: sessions slip, notes never get written up, and the insight ends up scattered across individual notebooks and laptops. We build a single tracker for the whole relationship model – stakeholders, tasks, follow-ups and notes in one place – with an AI layer reading across the notes to surface emerging risks and recurring themes. It turns everyday stakeholder contact into a live input for audit planning and risk assessment: the <em>soft-signal</em> complement to continuous controls monitoring.
              </p>
            </div>
            <div className="svc-wide-side">
              <div className="tags">
                <span>Engagement tracker</span>
                <span>AI note insights</span>
                <span>Risk signals</span>
                <span>Audit planning</span>
                <span>Power Platform</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `ServicesTeaser.tsx`**

```tsx
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const TEASERS = [
  { id: "ccm", title: "Continuous Assurance & Controls Monitoring", blurb: "Always-on control monitoring instead of periodic samples" },
  { id: "genai", title: "GenAI for Internal Audit", blurb: "Governed LLM and vision AI across the audit lifecycle" },
  { id: "auto", title: "Audit & Analytics Automation", blurb: "Automate the audit operating model, not the judgement" },
  { id: "pm", title: "Process Mining & Process Intelligence", blurb: "See how a process actually runs, not how the flowchart says it does" },
  { id: "euc", title: "Self-Service Analytics Assurance", blurb: "Govern the Alteryx, Power BI and Python your business already built" },
  { id: "risk-intel", title: "Stakeholder & Risk Intelligence", blurb: "Turn everyday stakeholder contact into a live input for risk" },
];

export function ServicesTeaser() {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">What we do</span>
          <h2>Six ways we modernise your assurance</h2>
          <p>Four delivery lines plus two advisory lines that govern the tools you already have and turn stakeholder engagement into risk intelligence.</p>
        </Reveal>
        <div className="teaser-grid">
          {TEASERS.map((t) => (
            <Reveal as="article" className="teaser-card" key={t.id}>
              <h3>{t.title}</h3>
              <p>{t.blurb}</p>
              <Link href={`/services#${t.id}`} className="teaser-link">
                Learn more →
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="teaser-cta">
          <Link href="/services" className="btn btn-ghost">
            See all services <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `src/app/services/page.tsx`**

```tsx
import { Nav } from "@/components/sections/Nav";
import { Services } from "@/components/sections/Services";
import { Footer } from "@/components/sections/Footer";

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <Services />
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Swap `Services` for `ServicesTeaser` on the home page**

In `src/app/page.tsx`, replace the `Services` import/usage with `ServicesTeaser`:

```tsx
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Chooser } from "@/components/sections/Chooser";
import { Coverage } from "@/components/sections/Coverage";
import { Positioning } from "@/components/sections/Positioning";
import { ServicesTeaser } from "@/components/sections/ServicesTeaser";
import { Cases } from "@/components/sections/Cases";
import { TechStrip } from "@/components/sections/TechStrip";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Chooser />
      <Coverage />
      <ServicesTeaser />
      <Positioning />
      <Cases />
      <TechStrip />
      <Approach />
      <Contact />
      <Footer />
    </>
  );
}
```

(`Cases`, `TechStrip`, `Positioning`, `Approach` are removed from here in Tasks 4-5.)

- [ ] **Step 6: Add teaser-grid CSS and fix `.btn-ghost` for light backgrounds**

`.btn-ghost` currently only renders correctly on dark (`on-ink`) sections. `ServicesTeaser`'s CTA sits on a light section, so it needs a light-background variant, following the same `.on-ink` override pattern already used for `.eyebrow`. Replace the existing `.btn-ghost` rules (`globals.css:54-55`):

```css
.btn-ghost{border-color:var(--hair);color:var(--text)}
.btn-ghost:hover{border-color:var(--assure-deep);transform:translateY(-2px)}
.on-ink .btn-ghost{border-color:var(--hair-ink);color:var(--paper-text)}
.on-ink .btn-ghost:hover{border-color:var(--assure);color:#fff}
```

Add new teaser styles after the `/* SERVICES */` block:

```css
/* TEASERS */
.teaser-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:44px}
.teaser-card{background:#fff;border:1px solid var(--hair);border-radius:12px;padding:24px;transition:transform .3s var(--ease),border-color .3s}
.teaser-card:hover{transform:translateY(-4px);border-color:var(--assure)}
.teaser-card h3{font-size:1.08rem;margin-bottom:8px;font-weight:700}
.teaser-card p{color:var(--text-soft);font-size:.92rem}
.teaser-link{display:inline-block;margin-top:14px;font-family:var(--font-plex-mono),monospace;font-size:.76rem;color:var(--assure-deep);font-weight:600}
.teaser-cta{margin-top:28px}
.svc,.case{scroll-margin-top:90px}
@media(max-width:940px){.teaser-grid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.teaser-grid{grid-template-columns:1fr}}
```

- [ ] **Step 7: Verify**

Run `pnpm exec tsc --noEmit` — expect no errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: move full Services content to /services, add home teaser"
```

---

### Task 4: Work page + home teaser

**Files:**
- Modify: `src/components/sections/Cases.tsx`
- Create: `src/components/sections/WorkTeaser.tsx`
- Create: `src/app/work/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `Reveal`'s `id` prop from Task 3.
- Produces: `WorkTeaser` (no props) — used only by `src/app/page.tsx`.

- [ ] **Step 1: Rewrite `Cases.tsx` — drop `case-tag` ID codes, add anchor ids**

Copy in this file has no first-person pronouns to begin with (confirmed by re-reading it), so no voice changes are needed — only the `tag` field removal and `id` addition:

```tsx
import { Reveal } from "@/components/Reveal";

const CASES = [
  { id: "ccm-01", cap: "Continuous monitoring", title: "Continuous controls monitoring platform", metric: "24/7", metricLabel: "Always-on monitoring", challenge: "Controls assurance relied on periodic, sample-based testing – long gaps and no live view of control health.", built: "A monitoring platform in Microsoft Fabric: controls-performance feeds from multiple systems, blended via dataflows, with exception logic and combined scorecards in Power BI Service and Power Automate alerts the moment a control breaches.", chips: ["Microsoft Fabric", "Power BI", "Power Automate"] },
  { id: "ccm-02", cap: "Manual control, automated", title: "Unstructured email into a tested control", metric: "100%", metricLabel: "Population, not a sample", challenge: "Manual controls that hinge on reading inbound email get tested by sampling a handful – most of the population goes unchecked.", built: "AI that turns an unstructured email feed into a structured dataset the moment mail lands, then reconciles it against the business record so the whole population is tested automatically. First applied to corporate-action notifications; the pattern fits any email-driven control.", chips: ["Power Automate", "Alteryx", "Azure OpenAI", "Power BI"] },
  { id: "assur-01", cap: "Combined assurance", title: "Firm-wide combined assurance map", metric: "4→1", metricLabel: "Assurance lines, one map", challenge: "Audit, risk, compliance and financial-crime teams assured risk in isolation – duplicated effort, blind spots at the seams.", built: "A single top-down assurance map in Power BI showing coverage and work performed across every line, so each can target genuine gaps rather than re-cover ground.", chips: ["Power BI", "SharePoint"] },
  { id: "genai-01", cap: "GenAI · at scale", title: "Bulk legal & document analysis", metric: "~3,000", metricLabel: "Documents analysed", challenge: "Large volumes of legal and client documents hold risk and insight no team can review manually at scale.", built: "A reusable GenAI engine for bulk extraction and analysis. In one application it analysed ~3,000 client documents for ESG consistency, using cohort analysis to flag outliers where messaging over- or understated ESG considerations.", chips: ["Databricks", "Azure OpenAI", "RAG"] },
  { id: "genai-02", cap: "GenAI · text", title: "Policy contradiction review", metric: "Whole", metricLabel: "Policy set, read at once", challenge: "Large policy estates accumulate internal contradictions manual review rarely catches in full.", built: "An LLM review that reads entire policy sets and flags inconsistencies and contradictions across long documents no reviewer could hold in their head at once.", chips: ["Azure OpenAI", "Text analysis"] },
  { id: "genai-03", cap: "Vision AI · fraud", title: "Fake-receipt detection with vision AI", metric: "Every", metricLabel: "Receipt image inspected", challenge: "The “receipt required” control is easy to game – people attach blank pages that say “no receipt” just to clear the check.", built: "A vision-AI indicator that inspects every uploaded image, separates genuine receipts from fabricated ones, and surfaces the highest-value cases, repeat claimants and the approvers signing them off.", chips: ["Azure OpenAI (Vision)", "Power BI"] },
  { id: "pm-01", cap: "Process mining", title: "End-to-end process mining", metric: "12-mo", metricLabel: "Event log reconstructed", challenge: "A creation, approval and distribution process was assumed to run one way; no one had seen how it actually ran.", built: "Process mining across a 12-month event log – reconstructing the real process, its variants and rework loops, and quantifying the inefficiency.", chips: ["Process Mining", "Event-log analysis"] },
  { id: "auto-01", cap: "Automation", title: "Automated audit-action follow-up", metric: "0", metricLabel: "Manual chasing", challenge: "Chasing findings and actions across stakeholders was manual and time-consuming, dragging on completion rates.", built: "A Power Automate solution that notifies auditors and stakeholders of upcoming and overdue actions with full context, and opens the follow-up conversation automatically.", chips: ["Power Automate", "Teams"] },
  { id: "genai-04", cap: "GenAI · briefings", title: "Automated intelligence briefings", metric: "Any", metricLabel: "Source → scheduled digest", challenge: "Insight that would sharpen audit – incidents, control breaches, emerging risks, market news – sits scattered across systems and reaches the team late, or not at all.", built: "Briefings that pull from any source, have AI summarise and categorise, and land as a structured daily or weekly digest. Incident summaries were the first; the same engine drives any feed the team needs to stay ahead of.", chips: ["Power Automate", "Alteryx", "Azure OpenAI"] },
];

export function Cases() {
  return (
    <section className="sec cases" id="work">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Selected work</span>
          <h2>Assurance problems, solved in production</h2>
          <p>Drawn from delivery inside a large regulated financial-services firm and described here without identifying the client. Third-party platforms are named; internal systems are not.</p>
        </Reveal>

        <div className="case-grid">
          {CASES.map((c) => (
            <Reveal as="article" className="case" id={c.id} key={c.id}>
              <div className="case-top">
                <span className="case-cap">{c.cap}</span>
              </div>
              <h3>{c.title}</h3>
              <div className="case-metric">
                <span className="m">{c.metric}</span>
                <span className="ml">{c.metricLabel}</span>
              </div>
              <dl>
                <dt>Challenge</dt>
                <dd>{c.challenge}</dd>
                <dt className="ok">Built</dt>
                <dd>{c.built}</dd>
              </dl>
              <div className="chips">
                {c.chips.map((chip) => (
                  <span key={chip}>{chip}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" className="further">
          <span className="lab">Further work</span>
          <span className="item">PDF authorisation &amp; SoD testing · Alteryx + Python</span>
          <span className="item">Control-test generator · LLM</span>
          <span className="item">Audit QA challenge &amp; sentiment · LLM</span>
          <span className="item">Quarterly risk assessment · LLM</span>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `WorkTeaser.tsx`**

```tsx
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const TEASERS = [
  { id: "ccm-01", title: "Continuous controls monitoring platform", metric: "24/7", metricLabel: "Always-on monitoring" },
  { id: "genai-03", title: "Fake-receipt detection with vision AI", metric: "Every", metricLabel: "Receipt image inspected" },
  { id: "genai-01", title: "Bulk legal & document analysis", metric: "~3,000", metricLabel: "Documents analysed" },
];

export function WorkTeaser() {
  return (
    <section className="sec cases on-ink">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Selected work</span>
          <h2>Assurance problems, solved in production</h2>
          <p>Drawn from delivery inside a large regulated financial-services firm and described here without identifying the client.</p>
        </Reveal>
        <div className="teaser-grid">
          {TEASERS.map((t) => (
            <Reveal as="article" className="teaser-card teaser-card--dark" key={t.id}>
              <div className="case-metric">
                <span className="m">{t.metric}</span>
                <span className="ml">{t.metricLabel}</span>
              </div>
              <h3>{t.title}</h3>
              <Link href={`/work#${t.id}`} className="teaser-link teaser-link--dark">
                Read the case →
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="teaser-cta">
          <Link href="/work" className="btn btn-ghost">
            See all work <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/app/work/page.tsx`**

```tsx
import { Nav } from "@/components/sections/Nav";
import { Cases } from "@/components/sections/Cases";
import { Footer } from "@/components/sections/Footer";

export default function WorkPage() {
  return (
    <>
      <Nav />
      <Cases />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Swap `Cases` for `WorkTeaser` on the home page**

In `src/app/page.tsx`:

```tsx
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Chooser } from "@/components/sections/Chooser";
import { Coverage } from "@/components/sections/Coverage";
import { Positioning } from "@/components/sections/Positioning";
import { ServicesTeaser } from "@/components/sections/ServicesTeaser";
import { WorkTeaser } from "@/components/sections/WorkTeaser";
import { TechStrip } from "@/components/sections/TechStrip";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Chooser />
      <Coverage />
      <ServicesTeaser />
      <Positioning />
      <WorkTeaser />
      <TechStrip />
      <Approach />
      <Contact />
      <Footer />
    </>
  );
}
```

(`Positioning`, `TechStrip`, `Approach` are removed from here in Task 5.)

- [ ] **Step 5: Add dark-variant teaser CSS**

Append after the teaser CSS added in Task 3:

```css
.teaser-card--dark{background:var(--ink-2);border-color:var(--hair-ink)}
.teaser-card--dark:hover{border-color:var(--assure)}
.teaser-card--dark h3{color:#fff}
.teaser-link--dark{color:var(--assure)}
```

- [ ] **Step 6: Verify**

Run `pnpm exec tsc --noEmit` — expect no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: move full case-study content to /work, add home teaser"
```

---

### Task 5: How-we-work page (founder bio, approach, tech stack)

**Files:**
- Modify: `src/components/sections/Positioning.tsx`
- Modify: `src/components/sections/Approach.tsx`
- Create: `src/app/how-we-work/page.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new consumed elsewhere — `Positioning`, `Approach`, `TechStrip` are fully relocated off the home page after this task.

- [ ] **Step 1: Rewrite `Positioning.tsx` as a third-person founder bio**

```tsx
import { Reveal } from "@/components/Reveal";

export function Positioning() {
  return (
    <section className="positioning">
      <div className="wrap">
        <Reveal as="div" className="grid">
          <p className="big">Founded by an auditor who can build – and a data scientist who understands assurance</p>
          <div className="body">
            <p>
              Most audit-analytics advice comes from one of two camps: auditors who can&apos;t build, or technologists who don&apos;t understand assurance. K Real Solutions was founded by Kiryl to sit in the overlap –{" "}
              <strong>FCCA-qualified, with an MSc in Data Science and fifteen years across financial services and Big 4 audit (EY, KPMG)</strong>.
            </p>
            <p style={{ marginTop: 16 }}>
              That experience includes putting AI and automation into <strong>live production inside a large, regulated asset manager</strong> – solutions that survive contact with real controls, real regulators and real audit committees. That&apos;s the difference between a proof-of-concept and something your function can actually run.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: "We"-voice edit for `Approach.tsx`**

```tsx
import { Reveal } from "@/components/Reveal";

const APPROACH = [
  { title: "Assurance-first", body: "Designed by a team that has sat on both sides of the control – the analytics serve the assurance objective, not the other way round." },
  { title: "Human in the loop", body: "AI accelerates and widens coverage; auditors keep judgement and accountability. Explainable by design." },
  { title: "Works with your stack", body: "Microsoft and Azure, Alteryx, Databricks – we build on what you already have and can govern, not a black box." },
  { title: "Transfer, not lock-in", body: "Your team owns the solution and the know-how. Documentation and upskilling are part of the deliverable." },
];

export function Approach() {
  return (
    <section className="sec" id="approach">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">How we work</span>
          <h2>Built for regulated environments</h2>
          <p>Audit functions can&apos;t run on prototypes. Everything we deliver is designed to hold up under scrutiny – from your second line to your regulator.</p>
        </Reveal>
        <div className="appr-grid">
          {APPROACH.map((a) => (
            <Reveal as="div" className="appr" key={a.title}>
              <h4>{a.title}</h4>
              <p>{a.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/app/how-we-work/page.tsx`**

`TechStrip.tsx` needs no content changes (it's a plain list of tool names, no pronouns, no periods) — just relocate its usage here.

```tsx
import { Nav } from "@/components/sections/Nav";
import { Positioning } from "@/components/sections/Positioning";
import { Approach } from "@/components/sections/Approach";
import { TechStrip } from "@/components/sections/TechStrip";
import { Footer } from "@/components/sections/Footer";

export default function HowWeWorkPage() {
  return (
    <>
      <Nav />
      <Positioning />
      <Approach />
      <TechStrip />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Final home-page composition**

`src/app/page.tsx` now reaches its restructure-complete state (the health-check freebar link is wired in Task 9, no further page.tsx edits needed after this):

```tsx
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Chooser } from "@/components/sections/Chooser";
import { Coverage } from "@/components/sections/Coverage";
import { ServicesTeaser } from "@/components/sections/ServicesTeaser";
import { WorkTeaser } from "@/components/sections/WorkTeaser";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Chooser />
      <Coverage />
      <ServicesTeaser />
      <WorkTeaser />
      <Contact />
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Verify**

Run `pnpm exec tsc --noEmit` — expect no errors. Grep for any remaining reference to the old `#approach`/`#work` (as a link target, not the `Cases` section id which legitimately keeps `id="work"` on the `/work` page) inside `src/` pointing at the home page — there should be none left over from the pre-restructure single-page nav.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add /how-we-work page, finalise trimmed home composition"
```

---

### Task 6: Bug fixes — contact form legibility, header tagline contrast, period sweep

**Files:**
- Modify: `src/components/sections/EnquiryForm.tsx`
- Modify: `src/app/globals.css`

**Interfaces:** none — pure styling/copy fixes, no signature changes.

- [ ] **Step 1: Add a `className` hook to the enquiry form**

In `EnquiryForm.tsx`, change the `<form>` tag (only this one line changes — leave every other line, including `noValidate`, the honeypot block, field markup, and submit-handler logic, exactly as-is):

```tsx
<form className="enquiry-form" onSubmit={handleSubmit} noValidate>
```

- [ ] **Step 2: Style the form's inputs in `globals.css`**

There is currently zero CSS for `input`/`select`/`textarea` anywhere in the file — confirmed by grep. Add this block after the `/* CONTACT */` section:

```css
/* ENQUIRY FORM */
.enquiry-form label{display:flex;flex-direction:column;gap:6px;font-size:.92rem;color:var(--paper-text-soft);text-align:left}
.enquiry-form input,.enquiry-form select,.enquiry-form textarea{font-family:var(--font-plex-sans),sans-serif;font-size:.96rem;color:var(--paper-text);background:var(--ink-2);border:1px solid var(--hair-ink);border-radius:7px;padding:11px 13px;transition:border-color .2s}
.enquiry-form input:focus,.enquiry-form select:focus,.enquiry-form textarea:focus{outline:none;border-color:var(--assure)}
.enquiry-form textarea{resize:vertical}
```

- [ ] **Step 3: Fix the header tagline contrast**

`.brand small` (`globals.css:34`) is `.62rem` at `var(--paper-text-soft)` (#93A6A9), which is both too small and too low-contrast against the nav's near-black background. Change it to:

```css
.brand small{font-family:var(--font-plex-mono),monospace;font-weight:400;font-size:.68rem;letter-spacing:.16em;color:var(--paper-text);text-transform:uppercase}
```

(`--paper-text` is #DDE6E5 — the same token already used for `.hero .lede` body copy on the identical `--ink` background, so it's a proven-legible pairing, not a new unverified color choice.)

- [ ] **Step 4: Sweep for remaining trailing periods on short standalone text**

Run this grep across every file touched by Tasks 1-5 to catch anything the per-task rewrites above missed:

```bash
grep -rnE '<h[1-4][^>]*>[^<]*\.</h[1-4]>|<span className="eyebrow"[^>]*>[^<]*\.</span>|<h[1-4]>[^<]*\.<' src/components/sections/ src/app/page.tsx
```

Fix any match found by removing the trailing period, unless the matched text is genuinely a multi-sentence paragraph (which this grep pattern is deliberately narrow enough to avoid — it only matches headings/eyebrows, not `<p>` tags). Confirm zero matches remain by re-running the command.

- [ ] **Step 5: Verify in a real browser**

This is a visual/legibility fix — run `pnpm dev -p 3002` and check `/#contact` yourself (or ask the user to, sharing a screenshot): every form field should now show a visible dark-teal box with light, readable text and a visible border, and the header tagline should be comfortably readable at normal viewing distance. Do not assume a subagent should drive automated Chrome for this — a screenshot from the user's own browser is the verification method here.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: contact form field legibility, header tagline contrast, remaining periods"
```

---

### Task 7: Health-check types, schema, and deterministic scoring engine

**Files:**
- Create: `src/types/health-check.ts`
- Create: `src/lib/health-check-schema.ts`
- Create: `src/lib/health-check-scoring.ts`
- Modify: `src/types/intent.ts`
- Modify: `src/components/sections/EnquiryForm.tsx`

**Interfaces:**
- Produces: `Industry`, `TeamSize`, `Maturity`, `Budget`, `MaturityTier` types; `healthCheckSchema`/`HealthCheckInput`; `scoreMaturityTier(teamSize, maturity, budget): MaturityTier`; `MATURITY_TIER_LABELS: Record<MaturityTier, string>`; `getRecommendation(aim: IntentKey, tier: MaturityTier): { headline: string; body: string }`. Task 8 (quiz UI) and Task 9 (API route) both consume these exact names.
- Produces: `INTENT_LABELS: Record<IntentKey, string>` now exported from `src/types/intent.ts` — Task 8's quiz UI imports it for the "aim" question's answer labels, reusing the exact same labels `EnquiryForm` already uses instead of duplicating them.

- [ ] **Step 1: Export `INTENT_LABELS` from `src/types/intent.ts`**

```ts
export type IntentKey = "genai" | "starting" | "tools" | "continuous" | "exploring";

export const INTENT_LABELS: Record<IntentKey, string> = {
  genai: "Get value from GenAI in audit",
  starting: "Start our data-analytics journey",
  tools: "Get more from tools we own",
  continuous: "Move to continuous assurance",
  exploring: "Not sure yet",
};
```

- [ ] **Step 2: Update `EnquiryForm.tsx` to import the shared constant instead of declaring its own**

Remove the local `INTENT_LABELS` object from `EnquiryForm.tsx` and replace with an import:

```tsx
"use client";
import { useState, type FormEvent } from "react";
import { useIntent } from "@/context/IntentContext";
import { INTENT_LABELS } from "@/types/intent";
import type { IntentKey } from "@/types/intent";
```

(Delete the six-line `const INTENT_LABELS: Record<IntentKey, string> = {...}` block that previously followed the imports — everything else in the file is unchanged.)

- [ ] **Step 3: Create `src/types/health-check.ts`**

```ts
export type Industry =
  | "banking"
  | "asset_management"
  | "insurance"
  | "other_regulated_fs"
  | "manufacturing"
  | "retail"
  | "public_sector"
  | "healthcare"
  | "technology"
  | "energy"
  | "other";

export const INDUSTRY_LABELS: Record<Industry, string> = {
  banking: "Banking",
  asset_management: "Asset & investment management",
  insurance: "Insurance",
  other_regulated_fs: "Other regulated financial services",
  manufacturing: "Manufacturing",
  retail: "Retail & consumer",
  public_sector: "Public sector & government",
  healthcare: "Healthcare",
  technology: "Technology & software",
  energy: "Energy & utilities",
  other: "Other",
};

export type TeamSize = "1-5" | "6-15" | "16-50" | "50+";

export const TEAM_SIZE_LABELS: Record<TeamSize, string> = {
  "1-5": "1-5",
  "6-15": "6-15",
  "16-50": "16-50",
  "50+": "50+",
};

export type Maturity = "none" | "spreadsheets_bi" | "some_automation" | "advanced";

export const MATURITY_LABELS: Record<Maturity, string> = {
  none: "None yet",
  spreadsheets_bi: "Spreadsheets & BI",
  some_automation: "Some automation",
  advanced: "Advanced",
};

export type Budget = "exploring" | "small_pilot" | "dedicated";

export const BUDGET_LABELS: Record<Budget, string> = {
  exploring: "Exploring only",
  small_pilot: "Small pilot budget",
  dedicated: "Dedicated budget",
};

export type MaturityTier = "early" | "building" | "scaling";
```

- [ ] **Step 4: Create `src/lib/health-check-schema.ts`**

```ts
import { z } from "zod";

export const healthCheckSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  industry: z.enum([
    "banking",
    "asset_management",
    "insurance",
    "other_regulated_fs",
    "manufacturing",
    "retail",
    "public_sector",
    "healthcare",
    "technology",
    "energy",
    "other",
  ]),
  teamSize: z.enum(["1-5", "6-15", "16-50", "50+"]),
  maturity: z.enum(["none", "spreadsheets_bi", "some_automation", "advanced"]),
  budget: z.enum(["exploring", "small_pilot", "dedicated"]),
  aim: z.enum(["genai", "starting", "tools", "continuous", "exploring"]),
  painPoint: z.string().trim().max(1000).optional().or(z.literal("")),
  honeypot: z.string().max(200).optional().or(z.literal("")),
});

export type HealthCheckInput = z.infer<typeof healthCheckSchema>;
```

- [ ] **Step 5: Create `src/lib/health-check-scoring.ts`**

```ts
import type { TeamSize, Maturity, Budget, MaturityTier } from "@/types/health-check";
import type { IntentKey } from "@/types/intent";

const TEAM_SIZE_POINTS: Record<TeamSize, number> = { "1-5": 0, "6-15": 1, "16-50": 2, "50+": 3 };
const MATURITY_POINTS: Record<Maturity, number> = { none: 0, spreadsheets_bi: 1, some_automation: 2, advanced: 3 };
const BUDGET_POINTS: Record<Budget, number> = { exploring: 0, small_pilot: 1, dedicated: 3 };

export function scoreMaturityTier(teamSize: TeamSize, maturity: Maturity, budget: Budget): MaturityTier {
  const score = TEAM_SIZE_POINTS[teamSize] + MATURITY_POINTS[maturity] + BUDGET_POINTS[budget];
  if (score <= 2) return "early";
  if (score <= 5) return "building";
  return "scaling";
}

export const MATURITY_TIER_LABELS: Record<MaturityTier, string> = {
  early: "Early stage",
  building: "Building momentum",
  scaling: "Scaling up",
};

type Recommendation = { headline: string; body: string };

const RECOMMENDATIONS: Record<IntentKey, Record<MaturityTier, Recommendation>> = {
  genai: {
    early: {
      headline: "Early stage, and GenAI is the right place to start",
      body: "You're just beginning to explore data and AI in audit, and GenAI is often the fastest way to see real value – document review, fraud indicators, and QA that would take a team weeks can run in hours, with a human still signing off every result. We'd start with a short health check to find where it pays off first in your function.",
    },
    building: {
      headline: "You've got momentum – GenAI can extend it",
      body: "With some automation already in place, you're ready to add GenAI to the highest-value parts of the audit lifecycle: document and policy review, fraud indicators, and reporting. We build it to run safely in a regulated environment, with a human in the loop by design.",
    },
    scaling: {
      headline: "Advanced already – GenAI is your next multiplier",
      body: "Your analytics capability is ahead of most audit functions we see. GenAI is the natural next step: bulk document analysis, vision-based fraud detection, and automated briefings that free your best people for judgement, not admin.",
    },
  },
  starting: {
    early: {
      headline: "A strong starting point for your analytics journey",
      body: "You're early, and that's the best time to build the right foundations. We help audit teams take the first steps: quick wins that build confidence, a practical roadmap, and hands-on training so the capability stays with your people, not a contractor.",
    },
    building: {
      headline: "Ready to formalise what you've already started",
      body: "You've got some automation running – the next step is turning ad hoc wins into a repeatable capability. We help build the roadmap and train your team so momentum doesn't stall once the first project ends.",
    },
    scaling: {
      headline: "You've outgrown getting started",
      body: "Your maturity suggests you're past the early roadmap stage – worth a conversation about where continuous assurance or GenAI would take you next, rather than more foundational training.",
    },
  },
  tools: {
    early: {
      headline: "Get the value you already paid for",
      body: "You've invested in tools like Alteryx, Power BI, or Power Automate – we review what's been built for value, control weaknesses, and key-person risk, and help you unlock the use cases the licences were bought for in the first place.",
    },
    building: {
      headline: "Time to govern what your team has built",
      body: "With more automation in place, self-service risk grows alongside it. We review the estate for logic errors and hidden control weaknesses, and put governance in place to keep it audit-ready without slowing your team down.",
    },
    scaling: {
      headline: "An advanced estate deserves advanced governance",
      body: "At your level of maturity, self-built analytics is likely running critical processes. We assure the estate itself – logic, control weaknesses, documentation – so it holds up under scrutiny from your second line or a regulator.",
    },
  },
  continuous: {
    early: {
      headline: "Continuous assurance, built from a solid first step",
      body: "Moving from sampling to always-on monitoring is a bigger step when you're early – we'd start by picking one control and scoping exactly what continuous coverage would take, so you can see the shift before committing further.",
    },
    building: {
      headline: "You're well placed to move to continuous coverage",
      body: "With existing automation as a foundation, we design and build continuous controls monitoring: data feeds blended and scored, exceptions flagged and routed automatically, moving you from a sample to the full population.",
    },
    scaling: {
      headline: "Continuous assurance is the natural next step",
      body: "Your maturity and budget put full population coverage well within reach. We design and build always-on monitoring across your priority controls, with exceptions routed to the right auditor automatically.",
    },
  },
  exploring: {
    early: {
      headline: "A good place to start is a conversation",
      body: "Not sure yet what would move the needle – and that's fine. We'll have a short, no-obligation conversation about your controls, your data, and your team, and tell you honestly where analytics and AI would help, and where they wouldn't.",
    },
    building: {
      headline: "Let's find the highest-value next step",
      body: "You've already got some momentum but aren't sure what to prioritise next. We'll walk through your current estate and controls landscape and point to the one or two moves that would pay off fastest.",
    },
    scaling: {
      headline: "Your options are broader than you might think",
      body: "At your level of maturity, you likely have several good directions available – GenAI, continuous monitoring, or governing what you've already built. We'll help you weigh them against what matters most to your function right now.",
    },
  },
};

export function getRecommendation(aim: IntentKey, tier: MaturityTier): Recommendation {
  return RECOMMENDATIONS[aim][tier];
}
```

- [ ] **Step 6: Verify**

Run `pnpm exec tsc --noEmit` — expect no errors. This confirms the `Record<IntentKey, Record<MaturityTier, Recommendation>>` type covers all 5×3 combinations (TypeScript errors if any are missing).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add health-check types, schema, and deterministic scoring engine"
```

---

### Task 8: Health-check quiz UI

**Files:**
- Create: `src/components/sections/HealthCheckQuiz.tsx`
- Create: `src/app/health-check/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `healthCheckSchema`/`HealthCheckInput` (Task 7), `scoreMaturityTier`, `MATURITY_TIER_LABELS`, `getRecommendation` (Task 7), `INDUSTRY_LABELS`/`TEAM_SIZE_LABELS`/`MATURITY_LABELS`/`BUDGET_LABELS` (Task 7), `INTENT_LABELS` (Task 7), `useIntent` from `@/context/IntentContext` (existing).
- Produces: `HealthCheckQuiz` (no props), posts to `POST /api/health-check` (built in Task 9 — this task's submit handler calls that endpoint; the endpoint doesn't exist until Task 9, so end-to-end submission won't work until then, but the wizard's navigation, validation, and result-screen rendering with mocked/local data can be verified visually against the browser this task).

- [ ] **Step 1: Create `HealthCheckQuiz.tsx`**

```tsx
"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useIntent } from "@/context/IntentContext";
import { INTENT_LABELS } from "@/types/intent";
import type { IntentKey } from "@/types/intent";
import {
  INDUSTRY_LABELS,
  TEAM_SIZE_LABELS,
  MATURITY_LABELS,
  BUDGET_LABELS,
  type Industry,
  type TeamSize,
  type Maturity,
  type Budget,
} from "@/types/health-check";
import { scoreMaturityTier, getRecommendation, MATURITY_TIER_LABELS } from "@/lib/health-check-scoring";

type Answers = {
  industry: Industry | "";
  teamSize: TeamSize | "";
  maturity: Maturity | "";
  budget: Budget | "";
  aim: IntentKey | "";
  painPoint: string;
  name: string;
  email: string;
  honeypot: string;
};

const EMPTY_ANSWERS: Answers = {
  industry: "",
  teamSize: "",
  maturity: "",
  budget: "",
  aim: "",
  painPoint: "",
  name: "",
  email: "",
  honeypot: "",
};

type Status = "answering" | "submitting" | "result" | "error";

export function HealthCheckQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [status, setStatus] = useState<Status>("answering");
  const [errorMsg, setErrorMsg] = useState("");
  const { setIntent } = useIntent();

  const TOTAL_STEPS = 7; // industry, teamSize, maturity, budget, aim, painPoint, email

  function selectAndAdvance<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  async function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!answers.industry || !answers.teamSize || !answers.maturity || !answers.budget || !answers.aim) return;
    setStatus("submitting");

    const res = await fetch("/api/health-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });

    if (res.ok) {
      setStatus("result");
    } else {
      const body = await res.json().catch(() => ({ error: "Something went wrong." }));
      setErrorMsg(body.error || "Something went wrong.");
      setStatus("error");
    }
  }

  function bookConversation() {
    if (answers.aim) setIntent(answers.aim);
  }

  if (status === "result" && answers.teamSize && answers.maturity && answers.budget && answers.aim) {
    const tier = scoreMaturityTier(answers.teamSize, answers.maturity, answers.budget);
    const rec = getRecommendation(answers.aim, tier);
    return (
      <div className="hc-result">
        <span className="tier">{MATURITY_TIER_LABELS[tier]}</span>
        <h2>{rec.headline}</h2>
        <p>{rec.body}</p>
        <p style={{ marginTop: 18, fontSize: ".85rem", color: "var(--paper-text-soft)" }}>
          We&apos;ve emailed a copy of this to {answers.email}.
        </p>
        <Link href="/#contact" className="btn btn-primary" style={{ marginTop: 24 }} onClick={bookConversation}>
          Book a conversation <span className="arrow">→</span>
        </Link>
      </div>
    );
  }

  const progress = Math.min(step, TOTAL_STEPS);

  return (
    <div className="hc">
      <div className="hc-progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span key={i} className={i < progress ? "done" : ""} />
        ))}
      </div>

      <div className="hc-step">
        {step === 0 && (
          <>
            <h2>What industry are you in?</h2>
            <select
              className="hc-select"
              value={answers.industry}
              onChange={(e) => selectAndAdvance("industry", e.target.value as Industry)}
            >
              <option value="" disabled>
                Choose an industry
              </option>
              {(Object.keys(INDUSTRY_LABELS) as Industry[]).map((key) => (
                <option key={key} value={key}>
                  {INDUSTRY_LABELS[key]}
                </option>
              ))}
            </select>
          </>
        )}

        {step === 1 && (
          <>
            <h2>How big is your audit team?</h2>
            <div className="hc-options">
              {(Object.keys(TEAM_SIZE_LABELS) as TeamSize[]).map((key) => (
                <button key={key} className="hc-option" onClick={() => selectAndAdvance("teamSize", key)}>
                  {TEAM_SIZE_LABELS[key]}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>What's your current data & analytics maturity?</h2>
            <div className="hc-options">
              {(Object.keys(MATURITY_LABELS) as Maturity[]).map((key) => (
                <button key={key} className="hc-option" onClick={() => selectAndAdvance("maturity", key)}>
                  {MATURITY_LABELS[key]}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>What's your analytics/AI budget appetite?</h2>
            <div className="hc-options">
              {(Object.keys(BUDGET_LABELS) as Budget[]).map((key) => (
                <button key={key} className="hc-option" onClick={() => selectAndAdvance("budget", key)}>
                  {BUDGET_LABELS[key]}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2>What's your primary aim?</h2>
            <div className="hc-options">
              {(Object.keys(INTENT_LABELS) as IntentKey[]).map((key) => (
                <button key={key} className="hc-option" onClick={() => selectAndAdvance("aim", key)}>
                  {INTENT_LABELS[key]}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2>What's your biggest current pain point?</h2>
            <textarea
              className="hc-textarea"
              rows={4}
              placeholder="Optional – tell us more if you'd like"
              value={answers.painPoint}
              onChange={(e) => setAnswers((a) => ({ ...a, painPoint: e.target.value }))}
            />
            <div className="hc-nav">
              <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
                Next <span className="arrow">→</span>
              </button>
            </div>
          </>
        )}

        {step === 6 && (
          <form onSubmit={handleEmailSubmit} className="hc-email-form">
            <h2>Where should we send your results?</h2>
            <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
              <label htmlFor="hc_company_website">Leave this field empty</label>
              <input
                type="text"
                id="hc_company_website"
                tabIndex={-1}
                autoComplete="off"
                value={answers.honeypot}
                onChange={(e) => setAnswers((a) => ({ ...a, honeypot: e.target.value }))}
              />
            </div>
            <label>
              Name
              <input
                type="text"
                required
                autoComplete="name"
                value={answers.name}
                onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={answers.email}
                onChange={(e) => setAnswers((a) => ({ ...a, email: e.target.value }))}
              />
            </label>
            {status === "error" && (
              <p role="alert" style={{ color: "var(--exception-red)" }}>
                {errorMsg}
              </p>
            )}
            <div className="hc-nav">
              <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
                {status === "submitting" ? "Scoring…" : "See my results"} <span className="arrow">→</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
```

Note: the result screen's "Book a conversation" button must stay a `next/link` `Link`, not a plain `<a>`. `IntentProvider` lives in the root layout, so its state survives a client-side route transition — but a plain `<a>` to a different route (`/health-check` → `/`) triggers a full browser navigation that remounts the entire React tree, wiping the `setIntent()` call in `bookConversation()` before `EnquiryForm` ever reads it. `Link` performs the navigation client-side (state survives) and also handles the `#contact` hash scroll on arrival.

- [ ] **Step 2: Create `src/app/health-check/page.tsx`**

```tsx
import { Nav } from "@/components/sections/Nav";
import { HealthCheckQuiz } from "@/components/sections/HealthCheckQuiz";
import { Footer } from "@/components/sections/Footer";

export default function HealthCheckPage() {
  return (
    <>
      <Nav />
      <section className="sec on-ink" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="sec-head" style={{ margin: "0 auto 8px", textAlign: "center", maxWidth: "48ch" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>
              Health check
            </span>
            <h2>Where does your audit function stand?</h2>
            <p style={{ margin: "18px auto 0" }}>
              Six quick questions. We&apos;ll tell you where you sit and the single best-fit next step – no
              sales call required to see it.
            </p>
          </div>
          <HealthCheckQuiz />
        </div>
      </section>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Add quiz wizard CSS to `globals.css`**

```css
/* HEALTH CHECK */
.hc{padding:56px 0 20px;max-width:640px;margin:0 auto}
.hc-progress{display:flex;gap:6px;margin-bottom:8px}
.hc-progress span{height:4px;flex:1;background:var(--hair-ink);border-radius:2px}
.hc-progress span.done{background:var(--assure)}
.hc-step{background:var(--ink-2);border:1px solid var(--hair-ink);border-radius:14px;padding:40px}
.hc-step h2{color:#fff;font-size:1.35rem;margin-bottom:20px}
.hc-options{display:grid;gap:10px}
.hc-option{font-family:var(--font-plex-sans),sans-serif;font-weight:600;font-size:.96rem;padding:14px 18px;border-radius:9px;border:1px solid var(--hair-ink);background:var(--ink);color:var(--paper-text);cursor:pointer;text-align:left;transition:border-color .2s,background .2s}
.hc-option:hover{border-color:var(--assure)}
.hc-select{width:100%;font-size:.98rem;padding:12px 14px;border-radius:9px;border:1px solid var(--hair-ink);background:var(--ink);color:var(--paper-text)}
.hc-textarea{width:100%;font-family:var(--font-plex-sans),sans-serif;font-size:.96rem;padding:12px 14px;border-radius:9px;border:1px solid var(--hair-ink);background:var(--ink);color:var(--paper-text);resize:vertical}
.hc-nav{display:flex;justify-content:space-between;margin-top:24px}
.hc-email-form{display:flex;flex-direction:column;gap:14px}
.hc-email-form label{display:flex;flex-direction:column;gap:6px;font-size:.92rem;color:var(--paper-text-soft);text-align:left}
.hc-email-form input{font-family:var(--font-plex-sans),sans-serif;font-size:.96rem;color:var(--paper-text);background:var(--ink);border:1px solid var(--hair-ink);border-radius:7px;padding:11px 13px}
.hc-result{background:var(--ink-2);border:1px solid var(--hair-ink);color:#fff;border-radius:14px;padding:40px;max-width:640px;margin:0 auto;text-align:center}
.hc-result .tier{font-family:var(--font-plex-mono),monospace;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--assure)}
.hc-result h2{color:#fff;font-size:1.6rem;margin:14px 0}
.hc-result p{color:var(--paper-text);font-size:1.02rem;max-width:52ch;margin:0 auto}
```

- [ ] **Step 4: Verify**

Run `pnpm exec tsc --noEmit` — expect no errors. Run `pnpm dev -p 3002` and walk through the quiz yourself (or ask the user to): all 6 questions plus the email step should advance correctly, Back should work from the pain-point and email steps, and submitting should currently show an error state (expected — `/api/health-check` doesn't exist until Task 9). That error path itself is worth eyeballing to confirm it renders legibly rather than crashing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add health-check quiz wizard UI at /health-check"
```

---

### Task 9: Health-check API route, Resend helper, Contact freebar repurpose

**Files:**
- Create: `src/app/api/health-check/route.ts`
- Modify: `src/lib/resend.ts`
- Modify: `src/components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `healthCheckSchema` (Task 7), `checkRateLimit` (existing `src/lib/rate-limit.ts`), `getSupabaseServerClient` (existing), `scoreMaturityTier`/`getRecommendation` (Task 7).
- Produces: `sendHealthCheckResult(input: HealthCheckInput & { tier: MaturityTier; recommendation: { headline: string; body: string } })` in `resend.ts`, used only by this task's route handler.

- [ ] **Step 1: Add `sendHealthCheckResult` to `resend.ts`**

```ts
import type { EnquiryInput } from "./enquiry-schema";
import type { HealthCheckInput } from "./health-check-schema";
import type { MaturityTier } from "@/types/health-check";

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

type HealthCheckResultInput = HealthCheckInput & {
  tier: MaturityTier;
  recommendation: { headline: string; body: string };
};

export async function sendHealthCheckResult(input: HealthCheckResultInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "K Real Solutions website <onboarding@resend.dev>",
      to: input.email,
      subject: "Your K Real Solutions health-check result",
      text: [
        `Hi ${input.name},`,
        "",
        input.recommendation.headline,
        input.recommendation.body,
        "",
        "Book a conversation: https://krealsolutions.co.uk/#contact",
      ].join("\n"),
    }),
  });

  const notifyTo = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!notifyTo) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "K Real Solutions website <onboarding@resend.dev>",
      to: notifyTo,
      subject: `New health-check completion from ${input.name}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Industry: ${input.industry}`,
        `Team size: ${input.teamSize}`,
        `Maturity: ${input.maturity}`,
        `Budget: ${input.budget}`,
        `Aim: ${input.aim}`,
        `Maturity tier: ${input.tier}`,
        `Pain point: ${input.painPoint || "—"}`,
      ].join("\n"),
    }),
  });
}
```

- [ ] **Step 2: Create `src/app/api/health-check/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { healthCheckSchema } from "@/lib/health-check-schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { scoreMaturityTier, getRecommendation } from "@/lib/health-check-scoring";
import { sendHealthCheckResult } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests – please try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = healthCheckSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check your answers and try again." }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

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
```

- [ ] **Step 3: Repurpose the "Health check" freebar card in `Contact.tsx` to link to `/health-check`**

```tsx
import { Reveal } from "@/components/Reveal";
import { EnquiryForm } from "./EnquiryForm";

export function Contact() {
  return (
    <section className="contact on-ink" id="contact">
      <Reveal as="div" className="wrap">
        <span className="eyebrow" style={{ justifyContent: "center" }}>
          Let&apos;s talk
        </span>
        <h2>Where could continuous assurance take your function?</h2>
        <p>A short, no-obligation conversation about your controls, your data, and where AI and automation would actually move the needle.</p>
        <div className="free-lead">
          <span className="eyebrow" style={{ justifyContent: "center", color: "var(--assure)" }}>
            Free ways to start
          </span>
        </div>
        <div className="freebar">
          <a href="/health-check" className="f">
            <span className="tag">No cost</span>
            <h4>Health check</h4>
            <p>Six quick questions – see where you stand and the single best-fit next step, instantly.</p>
          </a>
          <div className="f">
            <span className="tag">No cost</span>
            <h4>Intro with your IA team</h4>
            <p>A conversation with your auditors to explore what&apos;s possible and answer the hard questions. No pitch.</p>
          </div>
          <div className="f">
            <span className="tag">Included</span>
            <h4>Training &amp; upskilling</h4>
            <p>Hands-on sessions so your auditors build and review analytics themselves – the capability stays in-house.</p>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <EnquiryForm />
        </div>
        <div className="mailto">info@krealsolutions.co.uk</div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Add hover/link styling for the now-clickable freebar card**

`.freebar .f` (`globals.css`) is currently a plain `<div>` style with no hover state. Add:

```css
.freebar a.f{transition:transform .2s var(--ease),border-color .2s;cursor:pointer}
.freebar a.f:hover{border-color:var(--assure);transform:translateY(-2px)}
```

- [ ] **Step 5: Verify**

Run `pnpm exec tsc --noEmit` — expect no errors. Once Task 10's Supabase table exists, the end-to-end flow (fill quiz → see result → Book a conversation → land on `/#contact` with the matching intent pre-selected) can be verified — note that until Task 10 runs, submitting will 500 with "Something went wrong" (missing table), which is the same expected-failure pattern the original `/api/enquiry` route had before its own migration ran.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add /api/health-check route, result email, contact card link"
```

---

### Task 10: Supabase migration for `health_check_responses`

**Files:**
- Create: `supabase/migrations/20260817120000_create_health_check_responses.sql`

**Interfaces:**
- Produces: the `public.health_check_responses` table Task 9's route handler inserts into.

- [ ] **Step 1: Write the migration**

```sql
create table public.health_check_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  industry text not null,
  team_size text not null,
  maturity text not null,
  budget text not null,
  aim text not null,            -- 'genai' | 'starting' | 'tools' | 'continuous' | 'exploring'
  pain_point text,
  maturity_tier text not null   -- 'early' | 'building' | 'scaling'
);
alter table public.health_check_responses enable row level security;
-- No public policies. Inserts happen server-side with the service role key only.
```

- [ ] **Step 2: Apply the migration to the existing project**

The Supabase project already exists from the original build: **"KRealSolutions Website"**, project ref `hpemolpqyghkmzawywlm`, and `.env.local` already has valid `NEXT_PUBLIC_SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` values for it (set during Task 18 of the original plan). Do not create a new project or new credentials.

Use `mcp__claude_ai_Supabase__apply_migration` with the SQL from Step 1 against project `hpemolpqyghkmzawywlm`.
Verify: `mcp__claude_ai_Supabase__list_tables` shows `public.health_check_responses` with RLS enabled and no policies, alongside the existing `public.enquiries` table.

- [ ] **Step 3: Verify end-to-end**

Run `pnpm dev -p 3002` and complete the quiz at `/health-check` with real test data yourself (or ask the user to). Then use `mcp__claude_ai_Supabase__execute_sql` (`select * from health_check_responses order by created_at desc limit 5;`) to confirm the row landed with the correct `maturity_tier` and `aim` values. Also confirm the "Book a conversation" button on the result screen lands on `/#contact` with the matching intent pre-selected in the form's dropdown — this exercises the same `IntentContext` handoff the chooser uses, now triggered from a different route.

- [ ] **Step 4: Run the advisors check**

Use `mcp__claude_ai_Supabase__get_advisors` (security + performance) against the project; address anything flagged before moving on (expect none, given RLS is on with no public policies, matching the existing `enquiries` table's posture).

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260817120000_create_health_check_responses.sql
git commit -m "feat: add health_check_responses Supabase table migration"
```

---

### Task 11: Manual QA pass — full restructure verification

**Files:** none (verification only; fix forward in the relevant file if an issue is found).

**Interfaces:** none.

**Note on how to run this task:** the user's laptop has very limited RAM and live browser-automation QA has crashed it twice already this session. Do not launch automated Chrome/Playwright tooling for this task. Instead, run `pnpm dev -p 3002` and ask the user to check each item themselves in their own already-open browser, sharing screenshots back for review — this is the pattern that worked earlier in this session.

- [ ] **Step 1: Routing**

Confirm every Nav link (`Start here`, `Services`, `Work`, `Health check`, `Book a conversation`) and every Footer link (`Services`, `Work`, `How we work`, `Health check`) resolves to a real page with no 404s, from both the home page and from a subpage (i.e. the nav works identically no matter which page you started on).

- [ ] **Step 2: Teaser deep-links**

From the home page, click a `ServicesTeaser` card's "Learn more" link and confirm it lands on `/services` scrolled to the matching card (not just the top of the page). Repeat for a `WorkTeaser` card into `/work`.

- [ ] **Step 3: Chooser → contact handoff (still same-page, unaffected by the restructure)**

Click a chooser tab, then "Book it – free" — confirm it still smooth-scrolls to `#contact` on the home page with the matching intent pre-selected, exactly as before this restructure (this flow was not touched by any task above and should be a regression check, not a new behaviour).

- [ ] **Step 4: Health-check quiz → contact handoff (new)**

Complete the quiz at `/health-check` end to end, confirm the result screen shows a sensible maturity tier and recommendation, then click "Book a conversation" and confirm it navigates to `/#contact` with the matching intent pre-selected in the form.

- [ ] **Step 5: Contact form legibility**

Confirm every field in the enquiry form at `/#contact` is now clearly visible (dark box, light readable text, visible border) — this was the illegible-fields bug fixed in Task 6.

- [ ] **Step 6: Header tagline and general contrast**

Confirm the "AUDIT · ANALYTICS · AI" tagline next to the logo is now comfortably readable. Spot-check a few other dark-background sections (Hero, Contact, health-check quiz) for anything that still looks too low-contrast to read easily.

- [ ] **Step 7: Copy check**

Skim each page for any leftover first-person ("I"/"my") language that should be "we"/"our" (the rewrite tasks above should have caught all of it, but this is the final check), and confirm no `CCM-01`-style ID codes remain visible anywhere on `/services` or `/work`.

- [ ] **Step 8: Responsive check**

Resize to ~900px and ~600px on the home page and on `/health-check` (the newest, least-tested layout). Confirm the nav collapses correctly, teaser grids reflow to fewer columns, and the quiz wizard's option buttons and progress bar remain usable at narrow widths.

- [ ] **Step 9: Record any fixes as their own commits**

For each issue found and fixed during this pass:

```bash
git add <changed files>
git commit -m "fix: <specific issue found during QA>"
```

---
