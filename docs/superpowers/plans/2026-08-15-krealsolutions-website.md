# K Real Solutions Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `index.html` (the approved mockup, single source of truth for design/copy) into a production Next.js marketing site with a Supabase-backed enquiry form, deployed on Vercel from the existing GitHub repo `kirylka0007/KRealSolutions`.

**Architecture:** Next.js 14 App Router + TypeScript, single page (`/`) composed of ordered section components under `src/components/sections/`. The mockup's CSS is ported near-verbatim into `globals.css` (same class names, same selectors, same values) rather than rewritten as Tailwind utility classes — this is the lowest-risk way to satisfy the brief's "reproduce the look exactly," since re-deriving ~250 lines of hand-tuned CSS (gradients, grid animations, hover transforms) as utility classes risks visual drift. Tailwind is still installed and configured with the mockup's tokens as theme extensions (per brief §1/§3) and is available for any new UI, but is not used to re-implement existing mockup styling. All interactive mockup behaviour (reveal-on-scroll, count-up, live console feed, coverage grid fill, chooser tabs, mobile nav) is reimplemented as React hooks/components with identical visual behaviour and `prefers-reduced-motion` handling.

**Tech Stack:** Next.js 14 (App Router, TS), Tailwind CSS, `next/font/google`, zod, `@supabase/supabase-js`, Resend (optional), pnpm, Vercel, GitHub.

## Global Constraints

- Reproduce `index.html`'s design and copy exactly (colors, type, spacing, all four signature elements) — see `BUILD-BRIEF.md` §3, §4. Do not paraphrase copy.
- Never name the former employer. Keep "large regulated financial-services firm" / "large regulated asset manager" verbatim (`BUILD-BRIEF.md` §4, confirmed in spec).
- Section IDs must match the mockup exactly: `#top`, `#start`, `#problem`, `#coverage`, `#services`, `#work`, `#approach`, `#contact` (`index.html` header/section tags).
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — never `NEXT_PUBLIC_`, never referenced from a Client Component (`BUILD-BRIEF.md` §5).
- `prefers-reduced-motion`: counters snap to final values, console shows a static snapshot, grids render final state, no looping animation (`BUILD-BRIEF.md` §7, already implemented in `index.html`'s vanilla JS as the reference behaviour).
- Contact email everywhere: `info@krealsolutions.co.uk` (placeholder — domain/mailbox not yet purchased, flag in README). Canonical/OG domain: `https://krealsolutions.co.uk` (placeholder, flag in README).
- No CMS, no auth, no additional pages, no test framework (per approved spec — correctness verified via TypeScript + manual browser + Lighthouse, not unit tests).
- Package manager: pnpm. Repo: reuse existing public repo `https://github.com/kirylka0007/KRealSolutions` (already git-initialized locally with `origin` set and remote history merged — see `docs/superpowers/specs/2026-08-15-krealsolutions-website-design.md`).

---

## File Structure

```
src/
  app/
    layout.tsx              # root layout: fonts, metadata, IntentProvider
    page.tsx                 # composes all sections in mockup order
    globals.css              # ported mockup CSS + design-token variables
    sitemap.ts
    robots.ts
    api/
      enquiry/
        route.ts             # POST handler: validate -> rate-limit -> insert -> notify
  components/
    Reveal.tsx                # scroll-reveal wrapper (replaces .reveal/.in pattern)
    sections/
      Nav.tsx
      Hero.tsx
      LiveConsole.tsx
      Chooser.tsx
      StatBand.tsx
      Coverage.tsx
      DotGrid.tsx
      Positioning.tsx
      Services.tsx
      Cases.tsx
      TechStrip.tsx
      Approach.tsx
      Contact.tsx
      EnquiryForm.tsx
      Footer.tsx
  hooks/
    useReducedMotion.ts
    useReveal.ts
    useCountUp.ts
  context/
    IntentContext.tsx
  lib/
    supabase-server.ts
    enquiry-schema.ts
    rate-limit.ts
    resend.ts
  types/
    intent.ts
supabase/
  migrations/
    20260815120000_create_enquiries.sql
.env.example
.prettierrc
README.md                     # rewritten with dev/deploy/env docs
```

---

### Task 1: Install tooling and scaffold the Next.js app

**Files:**
- Create: entire scaffolded Next.js project at repo root (package.json, tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.mjs, src/app/layout.tsx, src/app/page.tsx, src/app/globals.css, .eslintrc, .gitignore)
- Preserve: `BUILD-BRIEF.md`, `index.html`, `README.md`, `docs/`, `.git/`

**Interfaces:**
- Produces: a runnable `pnpm dev` Next.js app at repo root; `src/app/page.tsx` and `src/app/layout.tsx` exist for later tasks to edit.

- [ ] **Step 1: Install pnpm via corepack**

Run: `corepack enable pnpm` then `corepack prepare pnpm@latest --activate`
Verify: `pnpm --version` prints a version number.

- [ ] **Step 2: Scaffold Next.js into the repo root**

The directory is non-empty (`BUILD-BRIEF.md`, `index.html`, `README.md`, `docs/`, `.git/`), so `create-next-app` will refuse in-place. Scaffold into a temp sibling directory, then move the generated files into the repo root:

```bash
cd ..
pnpm dlx create-next-app@latest krealsolutions-scaffold \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm --no-turbopack --yes
```

Then move everything except its own `.git`/`README.md`/`node_modules` into the real repo root:

```bash
cd krealsolutions-scaffold
rm -rf .git node_modules README.md
cp -r . "../Audit D&A Website/"
cd "../Audit D&A Website"
rm -rf ../krealsolutions-scaffold
```

Note: keep the existing `README.md` (it will be rewritten in Task 17, not overwritten here).

- [ ] **Step 3: Install dependencies**

Run: `pnpm install`
Verify: `node_modules/` created, no errors.

- [ ] **Step 4: Verify the dev server boots**

Run: `pnpm dev` (in background or separate terminal), then fetch `http://localhost:3000`.
Expected: default Next.js starter page renders with no console errors. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app (App Router, TypeScript, Tailwind, pnpm)"
```

---

### Task 2: Design tokens, fonts, and global styles

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `IntentProvider` from `src/context/IntentContext.tsx` (Task 3) — `layout.tsx` wraps children with it. **Execution order note:** Task 3 must be implemented before this task, despite the numbering, because of this import. (Task 3 has no dependency on Task 2, so this is a one-directional reorder, not a cycle.)
- Produces: CSS custom properties (`--ink`, `--paper`, `--assure`, etc.) available globally; Tailwind theme tokens (`colors.ink`, `colors.assure`, etc.) for any new UI; `font-archivo`/`font-plex-sans`/`font-plex-mono` CSS variables from `next/font` for use in `globals.css` font-family rules.

- [ ] **Step 1: Set up fonts in the root layout**

`src/app/layout.tsx`:

```tsx
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { IntentProvider } from "@/context/IntentContext";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "K Real Solutions — Continuous, AI-driven assurance for internal audit",
  description:
    "Consulting for internal audit and assurance teams in regulated financial services: continuous controls monitoring, GenAI for audit, analytics automation and process mining — built by a qualified auditor and data scientist.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <IntentProvider>{children}</IntentProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Port design tokens and mockup CSS into `globals.css`**

Copy the entire `<style>` block from `index.html` lines 12–269 into `src/app/globals.css`, below the Tailwind directives, with these mechanical edits:
1. Keep every CSS custom property in `:root` from `index.html:12-21` verbatim (colors, `--maxw`, `--ease`).
2. Replace the three `font-family` declarations to use the `next/font` variables instead of the literal font names:
   - `body{font-family:"IBM Plex Sans",...}` → `body{font-family:var(--font-plex-sans),system-ui,sans-serif;...}`
   - `h1,h2,h3,h4{font-family:"Archivo",...}` → `font-family:var(--font-archivo),sans-serif;`
   - every `font-family:"IBM Plex Mono"` (in `.mono`, `.eyebrow`, `.console-bar .title`, `.live`, `.cs .l`, feed rows, stat sources, etc.) → `font-family:var(--font-plex-mono),monospace;`
3. Remove the `@import`/`<link>` Google Fonts references — `next/font` handles loading.
4. Keep every other selector, animation (`@keyframes beat`, `@keyframes slideIn`, `@keyframes fadeUp`), and media query (`@media(max-width:940px)`, `@media(max-width:560px)`, `@media(prefers-reduced-motion:reduce)`) unchanged.

- [ ] **Step 3: Extend Tailwind theme with the same tokens**

`tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        text: "var(--text)",
        "text-soft": "var(--text-soft)",
        "paper-text": "var(--paper-text)",
        "paper-text-soft": "var(--paper-text-soft)",
        assure: "var(--assure)",
        "assure-deep": "var(--assure-deep)",
        "assure-bright": "var(--assure-bright)",
        exception: "var(--exception)",
        "exception-red": "var(--exception-red)",
      },
      fontFamily: {
        archivo: ["var(--font-archivo)", "sans-serif"],
        "plex-sans": ["var(--font-plex-sans)", "sans-serif"],
        "plex-mono": ["var(--font-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 4: Verify**

Run: `pnpm build`
Expected: build succeeds with no CSS/type errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx tailwind.config.ts
git commit -m "feat: port design tokens, mockup CSS, and next/font setup"
```

---

### Task 3: Shared hooks and IntentContext

**Files:**
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/hooks/useReveal.ts`
- Create: `src/components/Reveal.tsx`
- Create: `src/types/intent.ts`
- Create: `src/context/IntentContext.tsx`

**Interfaces:**
- Produces: `useReducedMotion(): boolean`; `useReveal<T extends HTMLElement>(): { ref: RefObject<T>, revealed: boolean }`; `<Reveal>` component wrapping children with the mockup's `.reveal`/`.reveal.in` classes; `IntentKey` type; `useIntent(): { intent: IntentKey | null; setIntent: (k: IntentKey) => void }`.
- Consumes: nothing (foundation layer for Tasks 4–13).

- [ ] **Step 1: `src/types/intent.ts`**

```ts
export type IntentKey = "genai" | "starting" | "tools" | "continuous" | "exploring";
```

- [ ] **Step 2: `src/hooks/useReducedMotion.ts`**

```ts
"use client";
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 3: `src/hooks/useReveal.ts`**

Mirrors `index.html:733` (`IntersectionObserver` at `threshold:.14`, unobserve after first reveal), plus the reduced-motion mockup rule where `.reveal` starts visible (`index.html:267`).

```ts
"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return { ref, revealed };
}
```

- [ ] **Step 4: `src/components/Reveal.tsx`**

```tsx
"use client";
import { useReveal } from "@/hooks/useReveal";
import type { ElementType, ReactNode } from "react";

export function Reveal({
  as: Tag = "div",
  className = "",
  children,
  ariaHidden,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  ariaHidden?: boolean;
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal${revealed ? " in" : ""} ${className}`.trim()}
      aria-hidden={ariaHidden}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 5: `src/context/IntentContext.tsx`**

```tsx
"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { IntentKey } from "@/types/intent";

type IntentContextValue = {
  intent: IntentKey | null;
  setIntent: (key: IntentKey) => void;
};

const IntentContext = createContext<IntentContextValue | null>(null);

export function IntentProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<IntentKey | null>(null);
  return (
    <IntentContext.Provider value={{ intent, setIntent }}>{children}</IntentContext.Provider>
  );
}

export function useIntent(): IntentContextValue {
  const ctx = useContext(IntentContext);
  if (!ctx) throw new Error("useIntent must be used within IntentProvider");
  return ctx;
}
```

- [ ] **Step 6: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no type errors.

- [ ] **Step 7: Commit**

```bash
git add src/hooks src/components/Reveal.tsx src/types src/context
git commit -m "feat: add reveal/reduced-motion hooks and intent context"
```

---

### Task 4: Nav and Footer

**Files:**
- Create: `src/components/sections/Nav.tsx`
- Create: `src/components/sections/Footer.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `<Nav />`, `<Footer />` default exports for `page.tsx` (Task 14).

- [ ] **Step 1: `src/components/sections/Nav.tsx`**

Port markup from `index.html:273-284` into JSX (rename `class`→`className`, self-close `<span>`, `<button>`), reimplementing the burger toggle (`index.html:728-730`) as local state instead of DOM class toggling:

```tsx
"use client";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <a href="#top" className="brand">
          <span className="dot" />K&nbsp;REAL&nbsp;SOLUTIONS{" "}
          <small>Audit&nbsp;·&nbsp;Analytics&nbsp;·&nbsp;AI</small>
        </a>
        <div className={`nav-links${open ? " open" : ""}`} id="navlinks">
          <a href="#start" onClick={() => setOpen(false)}>
            Start here
          </a>
          <a href="#services" onClick={() => setOpen(false)}>
            Services
          </a>
          <a href="#work" onClick={() => setOpen(false)}>
            Selected work
          </a>
          <a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>
            Book a conversation
          </a>
        </div>
        <button
          className="burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: `src/components/sections/Footer.tsx`**

Port markup from `index.html:715-721` verbatim (copy unchanged), replacing the literal year with the current year:

```tsx
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap">
        <span className="brand">
          <span className="dot" /> K Real Solutions Ltd
        </span>
        <span>Internal audit · data analytics · AI &nbsp;·&nbsp; Registered in Scotland</span>
        <span>© {year} K Real Solutions Ltd</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/components/sections/Nav.tsx src/components/sections/Footer.tsx`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Nav.tsx src/components/sections/Footer.tsx
git commit -m "feat: add Nav and Footer components"
```

---

### Task 5: LiveConsole

**Files:**
- Create: `src/components/sections/LiveConsole.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` from Task 3.
- Produces: `<LiveConsole />` default export for `Hero` (Task 6).

- [ ] **Step 1: Implement, porting the feed simulation from `index.html:753-783`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PROCS = [
  "Trade reconciliation", "Corporate action", "Access review", "PDF authorisation",
  "Expense claim", "Journal posting", "Vendor onboarding", "Client report",
  "Payment run", "Fund pricing", "Segregation of duties", "Sanctions screening",
  "Fee calculation", "Data lineage check",
];
const STATIC_SNAPSHOT: Array<[string, boolean]> = [
  ["Trade reconciliation", false], ["Corporate action", false], ["Access review", true],
  ["Journal posting", false], ["Fund pricing", false], ["Client report", false],
];
const MAX_ROWS = 6;

function fmt(v: number) {
  return v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function randomId() {
  return "CTL-" + String(Math.floor(Math.random() * 9999)).padStart(4, "0");
}

type Row = { id: string; proc: string; isExc: boolean; key: string };

export function LiveConsole() {
  const reduced = useReducedMotion();
  const [rows, setRows] = useState<Row[]>([]);
  const [controls, setControls] = useState(12840);
  const [exceptions, setExceptions] = useState(37);
  const keyCounter = useRef(0);

  useEffect(() => {
    if (reduced) {
      setRows(
        STATIC_SNAPSHOT.map(([proc, isExc]) => ({
          id: randomId(),
          proc,
          isExc,
          key: String(keyCounter.current++),
        }))
      );
      return;
    }

    function addRow() {
      const isExc = Math.random() < 0.16;
      setRows((prev) => [
        { id: randomId(), proc: PROCS[Math.floor(Math.random() * PROCS.length)], isExc, key: String(keyCounter.current++) },
        ...prev,
      ].slice(0, MAX_ROWS));
      setControls((c) => c + Math.floor(Math.random() * 7) + 3);
      if (isExc) setExceptions((e) => e + 1);
    }

    for (let i = 0; i < MAX_ROWS; i++) addRow();
    const id = setInterval(addRow, 1700);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="console reveal in" aria-hidden="true">
      <div className="console-bar">
        <span className="title">Continuous controls monitor</span>
        <span className="live">
          <i />
          LIVE
        </span>
      </div>
      <div className="console-stats">
        <div className="cs">
          <div className="n">{fmt(controls)}</div>
          <div className="l">Controls evaluated today</div>
        </div>
        <div className="cs exc">
          <div className="n">{fmt(exceptions)}</div>
          <div className="l">Exceptions auto-flagged</div>
        </div>
      </div>
      <div className="feed">
        {rows.map((row) => (
          <div key={row.key} className={`feed-row${row.isExc ? " is-exc" : ""}`}>
            <span className="id">{row.id}</span>
            <span className="proc">{row.proc}</span>
            {row.isExc ? (
              <span className="st exc">⚑ EXCEPTION</span>
            ) : (
              <span className="st pass">✓ PASS</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no type errors. (Full visual verification happens in Task 15 once mounted in the page.)

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/LiveConsole.tsx
git commit -m "feat: add LiveConsole signature widget"
```

---

### Task 6: Hero

**Files:**
- Create: `src/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `LiveConsole` (Task 5), `Reveal` (Task 3).
- Produces: `<Hero />` for `page.tsx` (Task 14).

- [ ] **Step 1: Port markup and copy from `index.html:287-318` verbatim**

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
            <span className="em">continuous, AI-driven assurance.</span>
          </h1>
          <p className="lede">
            I help internal audit and assurance teams in regulated financial services replace
            manual, point-in-time testing with continuous, AI-augmented assurance — designed and
            built by someone who is both a qualified auditor and a data scientist.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary">
              Book a conversation <span className="arrow">→</span>
            </a>
            <a href="#work" className="btn btn-ghost">
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

Note: `Reveal` defaults to a `div`; the mockup's hero copy block has no semantic requirement beyond a wrapping `div`, so the default tag is fine here.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: add Hero section"
```

---

### Task 7: Chooser (intent tabs + panels)

**Files:**
- Create: `src/components/sections/Chooser.tsx`

**Interfaces:**
- Consumes: `useIntent` from `IntentContext` (Task 3), `Reveal` (Task 3).
- Produces: `<Chooser />` for `page.tsx` (Task 14). Clicking "Book it — free" calls `setIntent(key)` then scrolls to `#contact`.

- [ ] **Step 1: Implement, porting all five panels' copy verbatim from `index.html:328-409`**

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
    heading: "You know GenAI could help audit. You need it to actually land — safely.",
    desc: "I find the highest-value uses across your audit lifecycle — document and policy review, fraud indicators, risk assessment, QA and reporting — and build them to run in a regulated environment, with a human in the loop.",
    rel: (
      <>
        Where I&apos;d start: <a href="#services">GenAI for Internal Audit</a>
        <br />
        Proof: bulk document analysis · fake-receipt detection · automated briefings
      </>
    ),
    offerTitle: "GenAI-in-audit health check",
    offerDesc: "A working session mapping where GenAI would pay off first in your function.",
  },
  {
    key: "starting",
    ix: "02",
    label: "Start our data-analytics journey",
    heading: "Your team is ready to start with analytics — but not sure where.",
    desc: "I help audit teams take the first steps: quick wins that build confidence, a practical roadmap, and hands-on training so the capability stays with your people, not with a contractor.",
    rel: (
      <>
        Where I&apos;d start: <a href="#services">Audit &amp; Analytics Automation</a> ·{" "}
        <a href="#services">Continuous Assurance foundations</a>
        <br />
        Plus: training &amp; upskilling built into the engagement
      </>
    ),
    offerTitle: "Intro session for your IA team",
    offerDesc: "A no-pitch conversation with your auditors, plus a starter roadmap for where to begin.",
  },
  {
    key: "tools",
    ix: "03",
    label: "Get more from tools we own",
    heading: "You've bought Alteryx, Power BI and Power Automate. Are they earning their keep?",
    desc: "I review what's already been built — for value, control weaknesses and key-person risk — govern the self-service estate, and unlock the use cases the licences were bought for in the first place.",
    rel: (
      <>
        Where I&apos;d start: <a href="#services">Self-Service Analytics Assurance</a> ·{" "}
        <a href="#services">Audit &amp; Analytics Automation</a>
        <br />
        Context: 88% of business spreadsheets contain errors (Panko / EuSpRIG)
      </>
    ),
    offerTitle: "Analytics-estate health check",
    offerDesc: "A review of what you've built and where the value — and the risk — is hiding.",
  },
  {
    key: "continuous",
    ix: "04",
    label: "Move to continuous assurance",
    heading: "Point-in-time testing is leaving gaps. You want always-on coverage.",
    desc: "I design and build continuous controls monitoring — data feeds blended and scored, exceptions flagged and routed to the right auditor automatically — so you move from a sample to the full population.",
    rel: (
      <>
        Where I&apos;d start: <a href="#services">Continuous Assurance &amp; Controls Monitoring</a>
        <br />
        Proof: continuous monitoring platform · unstructured email into a tested control
      </>
    ),
    offerTitle: "Continuous-assurance scoping call",
    offerDesc: "We pick one control and map exactly what always-on coverage would take.",
  },
  {
    key: "exploring",
    ix: "05",
    label: "Not sure yet",
    heading: "Not sure what you need? That's a perfectly good place to start.",
    desc: "A short, no-obligation conversation about your controls, your data and your team. I'll tell you honestly where analytics and AI would move the needle — and, just as usefully, where they wouldn't.",
    rel: (
      <>
        We can look across any of it: <a href="#services">the full range of services</a>
      </>
    ),
    offerTitle: "Initial conversation",
    offerDesc: "Fifteen minutes to work out whether there's a fit. No slides, no pressure.",
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
          <p>Pick the one that sounds most like you — I&apos;ll show you where I&apos;d start, and a no-cost way in.</p>
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
                    Book it — free <span className="arrow">→</span>
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

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Manual check (after Task 14 assembles the page): click each tab, confirm the matching panel shows and others hide (mirrors `index.html:821-825`).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Chooser.tsx
git commit -m "feat: add Chooser with intent handoff to contact form"
```

---

### Task 8: StatBand + useCountUp

**Files:**
- Create: `src/hooks/useCountUp.ts`
- Create: `src/components/sections/StatBand.tsx`

**Interfaces:**
- Consumes: `useReveal`, `useReducedMotion` (Task 3).
- Produces: `<StatBand />` for `page.tsx`.

- [ ] **Step 1: `src/hooks/useCountUp.ts`, porting the easing/format logic from `index.html:737-749`**

```ts
"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

function fmt(v: number, decimals: number) {
  return v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function useCountUp(
  active: boolean,
  target: number,
  { decimals = 0, prefix = "", suffix = "", duration = 1500 } = {}
) {
  const reduced = useReducedMotion();
  const [text, setText] = useState(prefix + fmt(0, decimals) + suffix);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setText(prefix + fmt(target, decimals) + suffix);
      return;
    }
    let raf = 0;
    const start = performance.now();
    function frame(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setText(prefix + fmt(target * eased, decimals) + suffix);
      if (p < 1) raf = requestAnimationFrame(frame);
      else setText(prefix + fmt(target, decimals) + suffix);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, target, decimals, prefix, suffix, duration, reduced]);

  return text;
}
```

- [ ] **Step 2: `src/components/sections/StatBand.tsx`, porting copy/values from `index.html:414-444`**

```tsx
"use client";
import { Reveal } from "@/components/Reveal";
import { useReveal } from "@/hooks/useReveal";
import { useCountUp } from "@/hooks/useCountUp";

const STATS = [
  { target: 5, suffix: "%", desc: "of annual revenue lost to occupational fraud — every year.", src: "ACFE · Report to the Nations 2026" },
  { target: 12, suffix: " mo", desc: "typical time a fraud runs before anyone detects it.", src: "ACFE · Report to the Nations 2026" },
  { target: 43, suffix: "%", desc: "of frauds surface through a tip — 3× more than any control.", src: "ACFE · Report to the Nations 2026" },
  { target: 3, suffix: "%", desc: "are caught by external audit. The rest are found some other way.", src: "ACFE / CAQ" },
];

function Stat({ target, suffix, desc, src }: (typeof STATS)[number]) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const text = useCountUp(revealed, target, { suffix });
  return (
    <div ref={ref} className={`stat reveal${revealed ? " in" : ""}`}>
      <div className="stat-num">{text}</div>
      <div className="stat-desc">{desc}</div>
      <div className="stat-src">{src}</div>
    </div>
  );
}

export function StatBand() {
  return (
    <section className="band" id="problem">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">The blind spot</span>
          <h2>Point-in-time testing misses what happens in between.</h2>
          <p>Sample-based assurance checks a fraction of activity, months apart. Here is the cost of the gap, in numbers no audit committee can ignore.</p>
        </Reveal>
        <div className="stat-grid">
          {STATS.map((s) => (
            <Stat key={s.desc} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useCountUp.ts src/components/sections/StatBand.tsx
git commit -m "feat: add StatBand with count-up stats"
```

---

### Task 9: Coverage + DotGrid

**Files:**
- Create: `src/components/sections/DotGrid.tsx`
- Create: `src/components/sections/Coverage.tsx`

**Interfaces:**
- Consumes: `useReveal`, `useReducedMotion`, `useCountUp` (Tasks 3, 8).
- Produces: `<Coverage />` for `page.tsx`.

- [ ] **Step 1: `src/components/sections/DotGrid.tsx`, porting the fixed sample/exception indices from `index.html:786-816`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TOTAL = 100;
const EXC_IDX = 63;
const SAMPLE_IDX = [7, 24, 52, 71, 88];

type Cell = "" | "tested" | "missed" | "on" | "flagged";

export function DotGridPast() {
  const cells: Cell[] = Array.from({ length: TOTAL }, (_, i) =>
    i === EXC_IDX ? "missed" : SAMPLE_IDX.includes(i) ? "tested" : ""
  );
  return (
    <div className="dotgrid">
      {cells.map((c, i) => (
        <div key={i} className={`cell${c ? " " + c : ""}`} />
      ))}
    </div>
  );
}

export function DotGridNow({
  onPctChange,
}: {
  onPctChange: (pct: number) => void;
}) {
  const reduced = useReducedMotion();
  const [filled, setFilled] = useState<Cell[]>(Array(TOTAL).fill(""));
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function fillNow() {
      if (reduced) {
        setFilled(Array.from({ length: TOTAL }, (_, i) => (i === EXC_IDX ? "flagged" : "on")));
        onPctChange(100);
        return;
      }
      for (let i = 0; i < TOTAL; i++) {
        setTimeout(() => {
          setFilled((prev) => {
            const next = [...prev];
            next[i] = i === EXC_IDX ? "flagged" : "on";
            return next;
          });
        }, i * 11);
      }
      const dur = TOTAL * 11 + 300;
      const start = performance.now();
      function tick(now: number) {
        const p = Math.min((now - start) / dur, 1);
        onPctChange(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
        else onPctChange(100);
      }
      requestAnimationFrame(tick);
    }

    if (reduced) {
      fillNow();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            fillNow();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, onPctChange]);

  return (
    <div className="dotgrid" ref={ref}>
      {filled.map((c, i) => (
        <div key={i} className={`cell${c ? " " + c : ""}`} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: `src/components/sections/Coverage.tsx`, porting copy from `index.html:447-476`**

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
          <h2>From a 5% sample to 100% monitored.</h2>
          <p>Continuous assurance doesn&apos;t test harder — it tests everything, all the time, and sends only the exceptions to a human. Same team, complete coverage.</p>
        </Reveal>

        <div className="cov-grid2">
          <Reveal as="div" className="cov-card past">
            <div className="cov-top">
              <span className="cov-kicker">Point-in-time sample</span>
              <span className="cov-pct">5%</span>
            </div>
            <DotGridPast />
            <div className="cov-note bad">
              <span className="tick">✕</span> One exception sat outside the sample — and was missed.
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
            <div className="txt">lower fraud losses at organisations that use proactive data analytics as a control, versus those that don&apos;t.</div>
            <div className="src">ACFE · Report to the Nations 2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/DotGrid.tsx src/components/sections/Coverage.tsx
git commit -m "feat: add Coverage section with dual dot-grid animation"
```

---

### Task 10: Positioning and Services

**Files:**
- Create: `src/components/sections/Positioning.tsx`
- Create: `src/components/sections/Services.tsx`

**Interfaces:**
- Consumes: `Reveal` (Task 3).
- Produces: `<Positioning />`, `<Services />` for `page.tsx`.

- [ ] **Step 1: `src/components/sections/Positioning.tsx`, porting copy verbatim from `index.html:479-489`**

```tsx
import { Reveal } from "@/components/Reveal";

export function Positioning() {
  return (
    <section className="positioning">
      <div className="wrap">
        <Reveal as="div" className="grid">
          <p className="big">An auditor who can build. A data scientist who understands assurance.</p>
          <div className="body">
            <p>
              Most audit-analytics advice comes from one of two camps: auditors who can&apos;t build, or technologists who don&apos;t understand assurance. I sit in the overlap —{" "}
              <strong>FCCA-qualified, with an MSc in Data Science and fifteen years across financial services and Big 4 audit (EY, KPMG)</strong>.
            </p>
            <p style={{ marginTop: 16 }}>
              More importantly, I&apos;ve put AI and automation into <strong>live production inside a large, regulated asset manager</strong> — solutions that survive contact with real controls, real regulators and real audit committees. That&apos;s the difference between a proof-of-concept and something your function can actually run.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `src/components/sections/Services.tsx`, porting all six service cards' copy verbatim from `index.html:492-547`**

```tsx
import { Reveal } from "@/components/Reveal";

const SERVICES = [
  { no: "01 / CCM", title: "Continuous Assurance & Controls Monitoring", body: "Design and build always-on control monitoring: data feeds from your source systems, blended and scored, with exception logic that surfaces breaches automatically and routes them to the right auditor — moving you from periodic samples to full-population coverage.", tags: ["Microsoft Fabric", "Power BI", "Dataflows", "Power Automate"] },
  { no: "02 / GENAI", title: "GenAI for Internal Audit", body: "Practical, governed LLM and vision AI across the audit lifecycle — document and policy review, risk assessment, fraud indicators, QA and reporting. Deployed safely for regulated environments, with a human in the loop by design.", tags: ["Azure OpenAI", "Databricks", "RAG", "Vision"] },
  { no: "03 / AUTO", title: "Audit & Analytics Automation", body: "Automate the audit operating model — follow-ups, request management, incident summarisation and reporting — so the team spends its time on judgement, not admin. Built on the Microsoft and Alteryx stack you already run.", tags: ["Power Automate", "Alteryx", "Python", "SharePoint"] },
  { no: "04 / PM", title: "Process Mining & Process Intelligence", body: "Reconstruct how a process actually runs from its event data — not how the flowchart says it does. Expose variants, rework loops and control gaps, and quantify the case for change with evidence, not anecdote.", tags: ["PM4Py", "Process Mining", "Event logs"] },
];

export function Services() {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">What I do</span>
          <h2>Four delivery lines, two advisory lines.</h2>
          <p>Capabilities that modernise your assurance — plus two advisory lines that govern the tools you already have and turn stakeholder engagement into risk intelligence. Every engagement includes knowledge transfer, so your team owns what we deliver.</p>
        </Reveal>
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <Reveal as="article" className="svc" key={s.no}>
              <span className="no">{s.no}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </Reveal>
          ))}

          <Reveal as="article" className="svc svc--wide">
            <div className="svc-wide-main">
              <span className="no">05 / EUC</span>
              <h3>Self-Service Analytics Assurance</h3>
              <p>
                Business-built Alteryx workflows, Power Automate flows, Power BI models and Python scripts now run critical processes — usually outside any formal development lifecycle. I review the estate for logic errors, hidden control weaknesses, key-person risk and missing documentation, and put the governance in place to keep it audit-ready. Assurance <em>over</em> the tools, not just building with them.
              </p>
              <div className="svc-stat">
                <b>88%</b> of business spreadsheets contain errors — that&apos;s the estate you&apos;re not testing. <span style={{ opacity: 0.6 }}>Panko / EuSpRIG</span>
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

          <Reveal as="article" className="svc svc--wide">
            <div className="svc-wide-main">
              <span className="no">06 / RISK-INTEL</span>
              <h3>Stakeholder & Risk Intelligence</h3>
              <p>
                Audit teams meet the business on a schedule — but those meetings are often run ad hoc: sessions slip, notes never get written up, and the insight ends up scattered across individual notebooks and laptops. I build a single tracker for the whole relationship model — stakeholders, tasks, follow-ups and notes in one place — with an AI layer reading across the notes to surface emerging risks and recurring themes. It turns everyday stakeholder contact into a live input for audit planning and risk assessment: the <em>soft-signal</em> complement to continuous controls monitoring.
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

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Positioning.tsx src/components/sections/Services.tsx
git commit -m "feat: add Positioning and Services sections"
```

---

### Task 11: Cases, TechStrip, Approach

**Files:**
- Create: `src/components/sections/Cases.tsx`
- Create: `src/components/sections/TechStrip.tsx`
- Create: `src/components/sections/Approach.tsx`

**Interfaces:**
- Consumes: `Reveal` (Task 3).
- Produces: `<Cases />`, `<TechStrip />`, `<Approach />` for `page.tsx`.

- [ ] **Step 1: `src/components/sections/Cases.tsx`, porting all 9 case cards + further-work strip verbatim from `index.html:550-669`**

```tsx
import { Reveal } from "@/components/Reveal";

const CASES = [
  { tag: "CCM-01", cap: "Continuous monitoring", title: "Continuous controls monitoring platform", metric: "24/7", metricLabel: "Always-on monitoring", challenge: "Controls assurance relied on periodic, sample-based testing — long gaps and no live view of control health.", built: "A monitoring platform in Microsoft Fabric: controls-performance feeds from multiple systems, blended via dataflows, with exception logic and combined scorecards in Power BI Service and Power Automate alerts the moment a control breaches.", chips: ["Microsoft Fabric", "Power BI", "Power Automate"] },
  { tag: "CCM-02", cap: "Manual control, automated", title: "Unstructured email into a tested control", metric: "100%", metricLabel: "Population, not a sample", challenge: "Manual controls that hinge on reading inbound email get tested by sampling a handful — most of the population goes unchecked.", built: "AI that turns an unstructured email feed into a structured dataset the moment mail lands, then reconciles it against the business record so the whole population is tested automatically. First applied to corporate-action notifications; the pattern fits any email-driven control.", chips: ["Power Automate", "Alteryx", "Azure OpenAI", "Power BI"] },
  { tag: "ASSUR-01", cap: "Combined assurance", title: "Firm-wide combined assurance map", metric: "4→1", metricLabel: "Assurance lines, one map", challenge: "Audit, risk, compliance and financial-crime teams assured risk in isolation — duplicated effort, blind spots at the seams.", built: "A single top-down assurance map in Power BI showing coverage and work performed across every line, so each can target genuine gaps rather than re-cover ground.", chips: ["Power BI", "SharePoint"] },
  { tag: "GENAI-01", cap: "GenAI · at scale", title: "Bulk legal & document analysis", metric: "~3,000", metricLabel: "Documents analysed", challenge: "Large volumes of legal and client documents hold risk and insight no team can review manually at scale.", built: "A reusable GenAI engine for bulk extraction and analysis. In one application it analysed ~3,000 client documents for ESG consistency, using cohort analysis to flag outliers where messaging over- or understated ESG considerations.", chips: ["Databricks", "Azure OpenAI", "RAG"] },
  { tag: "GENAI-02", cap: "GenAI · text", title: "Policy contradiction review", metric: "Whole", metricLabel: "Policy set, read at once", challenge: "Large policy estates accumulate internal contradictions manual review rarely catches in full.", built: "An LLM review that reads entire policy sets and flags inconsistencies and contradictions across long documents no reviewer could hold in their head at once.", chips: ["Azure OpenAI", "Text analysis"] },
  { tag: "GENAI-03", cap: "Vision AI · fraud", title: "Fake-receipt detection with vision AI", metric: "Every", metricLabel: "Receipt image inspected", challenge: "The “receipt required” control is easy to game — people attach blank pages that say “no receipt” just to clear the check.", built: "A vision-AI indicator that inspects every uploaded image, separates genuine receipts from fabricated ones, and surfaces the highest-value cases, repeat claimants and the approvers signing them off.", chips: ["Azure OpenAI (Vision)", "Power BI"] },
  { tag: "PM-01", cap: "Process mining", title: "End-to-end process mining", metric: "12-mo", metricLabel: "Event log reconstructed", challenge: "A creation, approval and distribution process was assumed to run one way; no one had seen how it actually ran.", built: "Process mining across a 12-month event log — reconstructing the real process, its variants and rework loops, and quantifying the inefficiency.", chips: ["Process Mining", "Event-log analysis"] },
  { tag: "AUTO-01", cap: "Automation", title: "Automated audit-action follow-up", metric: "0", metricLabel: "Manual chasing", challenge: "Chasing findings and actions across stakeholders was manual and time-consuming, dragging on completion rates.", built: "A Power Automate solution that notifies auditors and stakeholders of upcoming and overdue actions with full context, and opens the follow-up conversation automatically.", chips: ["Power Automate", "Teams"] },
  { tag: "GENAI-04", cap: "GenAI · briefings", title: "Automated intelligence briefings", metric: "Any", metricLabel: "Source → scheduled digest", challenge: "Insight that would sharpen audit — incidents, control breaches, emerging risks, market news — sits scattered across systems and reaches the team late, or not at all.", built: "Briefings that pull from any source, have AI summarise and categorise, and land as a structured daily or weekly digest. Incident summaries were the first; the same engine drives any feed the team needs to stay ahead of.", chips: ["Power Automate", "Alteryx", "Azure OpenAI"] },
];

export function Cases() {
  return (
    <section className="sec cases" id="work">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Selected work</span>
          <h2>Assurance problems, solved in production.</h2>
          <p>Drawn from delivery inside a large regulated financial-services firm and described here without identifying the client. Third-party platforms are named; internal systems are not.</p>
        </Reveal>

        <div className="case-grid">
          {CASES.map((c) => (
            <Reveal as="article" className="case" key={c.tag}>
              <div className="case-top">
                <span className="case-tag">{c.tag}</span>
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

- [ ] **Step 2: `src/components/sections/TechStrip.tsx`, porting from `index.html:672-679`**

```tsx
import { Reveal } from "@/components/Reveal";

const TECH = ["Microsoft Fabric", "Power BI", "Power Automate", "Alteryx", "Azure OpenAI", "Azure Databricks", "Python", "PM4Py", "RAG pipelines"];

export function TechStrip() {
  return (
    <div className="tech">
      <Reveal as="div" className="wrap">
        <span className="lab">Stack</span>
        {TECH.map((t) => (
          <span className="t" key={t}>
            {t}
          </span>
        ))}
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 3: `src/components/sections/Approach.tsx`, porting copy from `index.html:682-696`**

```tsx
import { Reveal } from "@/components/Reveal";

const APPROACH = [
  { title: "Assurance-first", body: "Designed by someone who has sat on both sides of the control — the analytics serve the assurance objective, not the other way round." },
  { title: "Human in the loop", body: "AI accelerates and widens coverage; auditors keep judgement and accountability. Explainable by design." },
  { title: "Works with your stack", body: "Microsoft and Azure, Alteryx, Databricks — I build on what you already have and can govern, not a black box." },
  { title: "Transfer, not lock-in", body: "Your team owns the solution and the know-how. Documentation and upskilling are part of the deliverable." },
];

export function Approach() {
  return (
    <section className="sec" id="approach">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">How I work</span>
          <h2>Built for regulated environments.</h2>
          <p>Audit functions can&apos;t run on prototypes. Everything I deliver is designed to hold up under scrutiny — from your second line to your regulator.</p>
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

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Cases.tsx src/components/sections/TechStrip.tsx src/components/sections/Approach.tsx
git commit -m "feat: add Cases, TechStrip, and Approach sections"
```

---

### Task 12: Validation schema and rate limiter

**Files:**
- Create: `src/lib/enquiry-schema.ts`
- Create: `src/lib/rate-limit.ts`

**Interfaces:**
- Produces: `enquirySchema: ZodSchema`, `type EnquiryInput = z.infer<typeof enquirySchema>`; `checkRateLimit(ip: string): boolean` (true = allowed).
- Consumes: nothing.

- [ ] **Step 1: `src/lib/enquiry-schema.ts`**

```ts
import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email().max(320),
  organisation: z.string().trim().max(200).optional().or(z.literal("")),
  role: z.string().trim().max(200).optional().or(z.literal("")),
  intent: z.enum(["genai", "starting", "tools", "continuous", "exploring"]).optional(),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
```

- [ ] **Step 2: `src/lib/rate-limit.ts`**

```ts
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  hits.set(ip, timestamps);
  return true;
}
```

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`
Manual check: in a scratch file or `node -e`, import isn't possible pre-build for ESM/TS directly — instead verify via the API route's manual test in Task 13 (this task only needs to typecheck cleanly; behavioural verification happens once wired into the route handler).

- [ ] **Step 4: Commit**

```bash
git add src/lib/enquiry-schema.ts src/lib/rate-limit.ts
git commit -m "feat: add enquiry validation schema and rate limiter"
```

---

### Task 13: Supabase server client, Resend helper, and /api/enquiry route

**Files:**
- Create: `src/lib/supabase-server.ts`
- Create: `src/lib/resend.ts`
- Create: `src/app/api/enquiry/route.ts`
- Create: `.env.example`

**Interfaces:**
- Consumes: `enquirySchema`, `checkRateLimit` (Task 12).
- Produces: `POST /api/enquiry` returning `{ ok: true }` (201) or `{ ok: false, error: string }` (400/429/500) for `EnquiryForm` (Task 14).

- [ ] **Step 1: `.env.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ENQUIRY_NOTIFY_EMAIL=info@krealsolutions.co.uk
```

- [ ] **Step 2: `src/lib/supabase-server.ts`**

```ts
import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase server environment variables");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
```

- [ ] **Step 3: `src/lib/resend.ts`**

```ts
import type { EnquiryInput } from "./enquiry-schema";

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
```

- [ ] **Step 4: `src/app/api/enquiry/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/enquiry-schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { notifyNewEnquiry } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests — please try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

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
    return NextResponse.json({ ok: false, error: "Something went wrong — please try again." }, { status: 500 });
  }

  await notifyNewEnquiry(parsed.data).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 201 });
}
```

- [ ] **Step 5: Install the Supabase client library**

Run: `pnpm add @supabase/supabase-js zod`

- [ ] **Step 6: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no type errors. Full runtime verification (real insert) happens in Task 16 once the real Supabase project exists.

- [ ] **Step 7: Commit**

```bash
git add src/lib/supabase-server.ts src/lib/resend.ts src/app/api/enquiry/route.ts .env.example package.json pnpm-lock.yaml
git commit -m "feat: add /api/enquiry route with validation, rate limiting, and Supabase insert"
```

---

### Task 14: EnquiryForm and Contact section

**Files:**
- Create: `src/components/sections/EnquiryForm.tsx`
- Create: `src/components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `useIntent` (Task 3), `POST /api/enquiry` (Task 13).
- Produces: `<Contact />` for `page.tsx` (Task 15).

- [ ] **Step 1: `src/components/sections/EnquiryForm.tsx`**

```tsx
"use client";
import { useState, type FormEvent } from "react";
import { useIntent } from "@/context/IntentContext";
import type { IntentKey } from "@/types/intent";

const INTENT_LABELS: Record<IntentKey, string> = {
  genai: "Get value from GenAI in audit",
  starting: "Start our data-analytics journey",
  tools: "Get more from tools we own",
  continuous: "Move to continuous assurance",
  exploring: "Not sure yet",
};

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm() {
  const { intent } = useIntent();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      organisation: String(data.get("organisation") || ""),
      role: String(data.get("role") || ""),
      intent: (data.get("intent") as IntentKey) || undefined,
      message: String(data.get("message") || ""),
      honeypot: String(data.get("company_website") || ""),
    };

    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      const body = await res.json().catch(() => ({ error: "Something went wrong." }));
      setErrorMsg(body.error || "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="offer" role="status">
        <h4>Thanks — that&apos;s landed.</h4>
        <p>I&apos;ll get back to you shortly to find a time to talk.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div style={{ display: "grid", gap: 14, textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <label>
          Name
          <input type="text" name="name" autoComplete="name" />
        </label>
        <label>
          Email *
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Organisation
          <input type="text" name="organisation" autoComplete="organization" />
        </label>
        <label>
          Role
          <input type="text" name="role" />
        </label>
        <label>
          What would you like to talk about?
          <select name="intent" defaultValue={intent ?? ""}>
            <option value="">Not sure yet</option>
            {(Object.keys(INTENT_LABELS) as IntentKey[]).map((key) => (
              <option key={key} value={key}>
                {INTENT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Message
          <textarea name="message" rows={4} />
        </label>

        {status === "error" && (
          <p role="alert" style={{ color: "var(--exception-red)" }}>
            {errorMsg}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Book a conversation"} <span className="arrow">→</span>
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: `src/components/sections/Contact.tsx`, porting copy from `index.html:699-713` and replacing the mailto with `EnquiryForm`**

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
          <div className="f">
            <span className="tag">No cost</span>
            <h4>Health check</h4>
            <p>A working session on your controls, data or analytics estate — you leave with a prioritised view of where AI and analytics would pay off.</p>
          </div>
          <div className="f">
            <span className="tag">No cost</span>
            <h4>Intro with your IA team</h4>
            <p>A conversation with your auditors to explore what&apos;s possible and answer the hard questions. No pitch.</p>
          </div>
          <div className="f">
            <span className="tag">Included</span>
            <h4>Training &amp; upskilling</h4>
            <p>Hands-on sessions so your auditors build and review analytics themselves — the capability stays in-house.</p>
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

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/EnquiryForm.tsx src/components/sections/Contact.tsx
git commit -m "feat: add EnquiryForm and Contact section, replacing mailto"
```

---

### Task 15: Page assembly, metadata, sitemap, robots, favicon

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx` (extend `metadata` with Open Graph)
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/icon.png` (or `favicon.ico`)

**Interfaces:**
- Consumes: all section components from Tasks 4–11, 14.
- Produces: the complete rendered `/` route.

- [ ] **Step 1: `src/app/page.tsx`, composing sections in the exact mockup order (`index.html:273-721`)**

```tsx
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Chooser } from "@/components/sections/Chooser";
import { StatBand } from "@/components/sections/StatBand";
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
      <StatBand />
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

- [ ] **Step 2: Extend metadata in `src/app/layout.tsx` with Open Graph tags (placeholder domain, per spec)**

Add to the existing `metadata` export from Task 2:

```ts
export const metadata: Metadata = {
  title: "K Real Solutions — Continuous, AI-driven assurance for internal audit",
  description:
    "Consulting for internal audit and assurance teams in regulated financial services: continuous controls monitoring, GenAI for audit, analytics automation and process mining — built by a qualified auditor and data scientist.",
  metadataBase: new URL("https://krealsolutions.co.uk"), // PLACEHOLDER — replace once domain is bought and DNS is live
  openGraph: {
    title: "K Real Solutions — Continuous, AI-driven assurance for internal audit",
    description:
      "Continuous controls monitoring, GenAI for audit, analytics automation and process mining — for internal audit teams in regulated financial services.",
    url: "https://krealsolutions.co.uk", // PLACEHOLDER
    siteName: "K Real Solutions",
    type: "website",
  },
};
```

- [ ] **Step 3: `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://krealsolutions.co.uk", // PLACEHOLDER — replace once domain is live
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
```

- [ ] **Step 4: `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://krealsolutions.co.uk/sitemap.xml", // PLACEHOLDER
  };
}
```

- [ ] **Step 5: Add a favicon**

Place a simple placeholder icon at `src/app/icon.png` (any square PNG, e.g. a plain teal square using `--assure` `#12A594` — this is a placeholder the user can replace with real branding later). Next.js auto-wires `src/app/icon.png` as the favicon; no manual `<link>` needed.

- [ ] **Step 6: Verify**

Run: `pnpm build`
Expected: build succeeds, no type/lint errors, sitemap and robots routes generated.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx src/app/sitemap.ts src/app/robots.ts src/app/icon.png
git commit -m "feat: assemble full page, add metadata, sitemap, robots, favicon"
```

---

### Task 16: Manual QA pass (browser, mobile, reduced motion, a11y, Lighthouse)

**Files:** none (verification only; fix forward in the relevant component file if an issue is found).

**Interfaces:** none.

**User instruction:** before or alongside this task's browser checks, invoke the `frontend-design:frontend-design` skill and use its guidance to review the rendered UI for visual quality/polish (not just functional correctness) — the mockup's design should read as intentional and distinctive, not templated, once it's live in a real browser rather than static HTML.

- [ ] **Step 1: Start the dev server and open it in a real browser**

Run: `pnpm dev`, then use the claude-in-chrome or chrome-devtools MCP tools to navigate to `http://localhost:3000`.

- [ ] **Step 2: Golden path — chooser → contact intent handoff**

Click each of the 5 chooser tabs, confirm the matching panel is shown. Click "Book it — free" on the GenAI panel; confirm the page smooth-scrolls to `#contact` and the EnquiryForm's intent `<select>` is pre-set to "Get value from GenAI in audit."

- [ ] **Step 3: Golden path — enquiry submission**

Fill in name/email/message, submit. Confirm the success state renders ("Thanks — that's landed."). This will only persist to Supabase once Task 18 wires the real project — before that, expect a 500 from the missing env vars; confirm the error state renders legibly instead of a blank crash.

- [ ] **Step 4: Honeypot check**

Using the browser devtools console, set the hidden `company_website` input's value and submit; confirm the request still returns success but no row would be inserted (verify against Supabase logs once Task 18 is live).

- [ ] **Step 5: Responsive check**

Resize the viewport to ~900px and ~600px (chrome-devtools `resize_page` or `emulate`). Confirm the nav collapses to the hamburger menu below 940px, opens/closes on click, and closes when a link is tapped; confirm stat/case/approach grids reflow per the mockup's breakpoints.

- [ ] **Step 6: Reduced motion check**

Emulate `prefers-reduced-motion: reduce` (chrome-devtools `emulate`). Reload. Confirm: stats and the 53% payoff counter show final values immediately, the LiveConsole shows the static 6-row snapshot with no interval updates, both dot grids render their final state immediately, and `.reveal` elements are visible without a fade-in transition.

- [ ] **Step 7: Keyboard and screen-reader-relevant checks**

Tab through the page: confirm every interactive element (nav links, burger, chooser tabs, "Book it — free" buttons, form fields, submit button) receives a visible focus ring, chooser tabs are reachable and activate on Enter/Space, and the `LiveConsole` container has `aria-hidden="true"` so it's skipped by assistive tech.

- [ ] **Step 8: Lighthouse audit**

Run `mcp__plugin_chrome-devtools-mcp_chrome-devtools__lighthouse_audit` (or equivalent) against `http://localhost:3000`. Confirm performance ≥ 90 and accessibility ≥ 95 per the brief's bar. If either falls short, identify the specific flagged issue and fix it in the relevant component before moving on.

- [ ] **Step 9: Record any fixes as their own commits**

For each issue found and fixed in Steps 2–8:

```bash
git add <changed files>
git commit -m "fix: <specific issue found during QA>"
```

---

### Task 17: README, .gitignore, Prettier

**Files:**
- Modify: `README.md`
- Modify: `.gitignore` (verify Next defaults + `.env*` are present — `create-next-app` includes this by default in Task 1; this task confirms and documents it)
- Create: `.prettierrc`

**Interfaces:** none.

- [ ] **Step 1: Verify `.gitignore` covers env files**

Open `.gitignore` (created by `create-next-app` in Task 1) and confirm it includes `.env*`. If missing, add:

```
.env*
!.env.example
```

- [ ] **Step 2: `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5"
}
```

- [ ] **Step 3: Rewrite `README.md`**

```markdown
# K Real Solutions — website

Marketing site for K Real Solutions Ltd: internal audit, data analytics, and AI consulting for regulated financial services. Single Next.js page with a Supabase-backed enquiry form.

## Local development

```bash
corepack enable pnpm
pnpm install
cp .env.example .env.local   # fill in real values, see below
pnpm dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only — never expose client-side |
| `RESEND_API_KEY` | no | Enables email notification on new enquiries |
| `ENQUIRY_NOTIFY_EMAIL` | no | Where new-enquiry alerts are sent, if Resend is enabled |

Set real values in Vercel → Settings → Environment Variables (Production + Preview) — never commit `.env.local`.

## Database

`supabase/migrations/` contains the schema. Apply with the Supabase CLI or MCP tooling against the project referenced in `NEXT_PUBLIC_SUPABASE_URL`.

## Deployment

- Hosted on Vercel, auto-deploying from `main` (production) and pull requests (preview).
- Push to `main` → production deploy.

## Known placeholders — fill in before going live

- **Domain:** the site currently uses `https://krealsolutions.co.uk` as a placeholder in canonical URLs, Open Graph tags, `sitemap.ts`, and `robots.ts`. Once the domain is bought:
  1. Update those four references to the real domain.
  2. Add the domain in Vercel → Settings → Domains.
  3. Point DNS: an `A` record (or `CNAME` for a subdomain) per Vercel's on-screen instructions at that step.
- **Contact email:** `info@krealsolutions.co.uk` is used in the Contact section and footer — swap once that mailbox exists.
- **Favicon:** `src/app/icon.png` is a plain placeholder square — replace with real branding.
- **Footer LinkedIn/phone:** not currently present — add to `src/components/sections/Footer.tsx` if wanted.
```

- [ ] **Step 4: Verify**

Run: `pnpm exec prettier --check .` (fix with `pnpm exec prettier --write .` if needed, then re-check).

- [ ] **Step 5: Commit**

```bash
git add README.md .gitignore .prettierrc
git commit -m "docs: rewrite README with dev/env/deploy docs, add Prettier config"
```

---

### Task 18: Create the real Supabase project and apply the migration

**Files:**
- Create: `supabase/migrations/20260815120000_create_enquiries.sql`

**Interfaces:**
- Produces: a live Supabase project; `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` values for local `.env.local` and later Vercel config.

- [ ] **Step 1: `supabase/migrations/20260815120000_create_enquiries.sql`, exactly per `BUILD-BRIEF.md` §5**

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

- [ ] **Step 2: Use the existing Supabase project**

The user already created an empty Supabase project for this site: **"KRealSolutions Website"**, project ref/id `hpemolpqyghkmzawywlm`, region `eu-west-1`, status `ACTIVE_HEALTHY` (confirmed via `mcp__claude_ai_Supabase__get_project`). Do not create a new project — use this one for all subsequent steps.

- [ ] **Step 3: Apply the migration**

Use `mcp__claude_ai_Supabase__apply_migration` with the SQL from Step 1 against project `hpemolpqyghkmzawywlm`.
Verify: `mcp__claude_ai_Supabase__list_tables` shows `public.enquiries` with RLS enabled and no policies.

- [ ] **Step 4: Pull the connection values**

Use `mcp__claude_ai_Supabase__get_project_url` and the service-role key from the project's API settings (via `mcp__claude_ai_Supabase__get_project` or the dashboard, since the service-role key is sensitive and not exposed by `get_publishable_keys`). Write them to a local `.env.local` (already gitignored):

```
NEXT_PUBLIC_SUPABASE_URL=<from get_project_url>
SUPABASE_SERVICE_ROLE_KEY=<from project API settings>
ENQUIRY_NOTIFY_EMAIL=info@krealsolutions.co.uk
```

- [ ] **Step 5: Verify end-to-end locally**

Run `pnpm dev`, submit the enquiry form with real test data, then use `mcp__claude_ai_Supabase__execute_sql` (`select * from enquiries order by created_at desc limit 5;`) to confirm the row landed with the right `intent` value when arriving via a chooser "Book it — free" link.

- [ ] **Step 6: Run the advisors check**

Use `mcp__claude_ai_Supabase__get_advisors` (security + performance) against the new project; address anything flagged before moving on (expect none, given RLS is on with no public policies).

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/20260815120000_create_enquiries.sql
git commit -m "feat: add Supabase enquiries table migration"
```

(`.env.local` is gitignored and is never committed.)

---

### Task 19: Push to GitHub and deploy on Vercel

**Files:** none (deployment/config only).

**Interfaces:** none.

- [ ] **Step 1: Push to the existing repo**

```bash
git push -u origin main
```

Git Credential Manager (bundled with Git for Windows) will open a browser window for GitHub auth on first push if no credentials are cached yet — no `gh` CLI needed. If the push fails with an auth error, ask the user to complete that browser sign-in and retry.

Verify: `https://github.com/kirylka0007/KRealSolutions` shows the full commit history and file tree.

- [ ] **Step 2: Import the project into Vercel**

Use `mcp__claude_ai_Vercel__create_git_project` (or `deploy_to_vercel`) pointed at `kirylka0007/KRealSolutions`, framework auto-detected as Next.js.

- [ ] **Step 3: Set environment variables in Vercel**

For both Production and Preview environments, set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENQUIRY_NOTIFY_EMAIL`
- `RESEND_API_KEY` (only if the user supplies one — otherwise leave unset; Resend notification is skipped gracefully per Task 13)

- [ ] **Step 4: Verify the production deploy**

Use `mcp__claude_ai_Vercel__get_deployment` / `list_deployments` to confirm a successful build from `main`. Open the resulting `*.vercel.app` URL and repeat the Task 16 golden-path check (chooser → contact → submit) against the live deployment, confirming the enquiry lands in the real Supabase table.

- [ ] **Step 5: Verify preview deploys**

Open a throwaway PR (e.g. a no-op whitespace change) against `main`, confirm Vercel posts a preview deployment URL, then close the PR without merging (or merge it if the user prefers — check with them first since merging is a shared-state action).

- [ ] **Step 6: Report the live URLs to the user**

Summarize: production URL, GitHub repo URL, Supabase project ref, and the outstanding placeholders from the Task 17 README (domain, contact email, favicon, footer links) that only the user can finalize.
