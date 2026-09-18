create table public.innovation_lab_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  title text not null,
  company text not null,
  company_website text not null,
  industry text not null,
  reason text not null,
  email text not null
);
alter table public.innovation_lab_requests enable row level security;
-- No public policies. Inserts happen server-side with the service role key only.
