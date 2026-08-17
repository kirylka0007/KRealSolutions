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
