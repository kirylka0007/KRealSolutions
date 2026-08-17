# K Real Solutions — website

Marketing site for K Real Solutions Ltd (company no. SC891005, Edinburgh, UK) — continuous assurance, GenAI, and analytics consulting for internal audit and wider assurance functions.

Built with Next.js 16 (App Router, TypeScript), hand-authored CSS in `src/app/globals.css` (not Tailwind utility classes), Supabase for form storage, and Resend for transactional email.

## Site structure

- `/` — landing page: hero, "Find your fit" chooser, coverage visual, service/work teasers, contact form
- `/services` — full service line-up
- `/who-we-are` — founder bio, approach, case studies, tech stack
- `/health-check` — interactive quiz with a deterministic (non-AI) scoring engine; result screen hands off into the contact form with the matching intent pre-selected
- `/health-check/lookup` — re-send a previous health-check result by email
- `/privacy` — privacy policy and Companies Act trading disclosure

## Local development

```bash
pnpm install
pnpm dev
```

Runs on `http://localhost:3000` by default (`pnpm dev -p <port>` to use another one).

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`. There's no automated test suite — correctness is verified via TypeScript (`pnpm exec tsc --noEmit`) and manual browser checks; see `docs/superpowers/` for the specs and plans this site was built from.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values (never commit `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=       # Project Settings -> API -> Project URL
SUPABASE_SERVICE_ROLE_KEY=      # Project Settings -> API -> service_role secret (never expose client-side)
RESEND_API_KEY=                 # optional - enquiry/health-check emails no-op silently without it
ENQUIRY_NOTIFY_EMAIL=info@krealsolutions.co.uk
```

The service-role key is server-only — it's read exclusively in `src/lib/supabase-server.ts` and is never referenced from a Client Component or exposed as `NEXT_PUBLIC_*`.

## Supabase

Project: [KRealSolutions Website](https://supabase.com/dashboard/project/hpemolpqyghkmzawywlm) (`hpemolpqyghkmzawywlm`, `eu-west-1`).

Migrations live in `supabase/migrations/` and have already been applied to the live project via the Supabase MCP tools:

- `enquiries` — contact-form submissions
- `health_check_responses` — completed health-check quizzes
- both: RLS enabled, no public policies — inserts happen server-side with the service-role key only, via `/api/enquiry` and `/api/health-check`

To apply migrations to a different/new project, run the SQL files in `supabase/migrations/` in filename order via the Supabase SQL editor or CLI.

## Deployment

Deploys on [Vercel](https://vercel.com) from this repo's `main` branch. Set the environment variables above in Vercel → Project Settings → Environment Variables (Production + Preview) — they are never committed.

## Known placeholders

A few details aren't final yet and are marked inline where they appear:

- **Domain**: `krealsolutions.co.uk` is not yet purchased — used as a placeholder in metadata/Open Graph tags and email links (`src/app/layout.tsx`, `src/app/sitemap.ts`).
- **Contact email**: `info@krealsolutions.co.uk` is a placeholder for the same reason.
- **Registered office address**: omitted from the footer and `/privacy` until confirmed — the Companies Act trading disclosure currently shows company name/number/jurisdiction only.
- **ICO registration**: not yet referenced anywhere on the site — handled separately, outside this codebase.
