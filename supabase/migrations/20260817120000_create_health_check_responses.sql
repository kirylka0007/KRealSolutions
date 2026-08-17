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
