-- Throttle for the public forms (see src/lib/form-guard.ts). Holds keyed
-- hashes (HMAC-SHA-256) of sender addresses and typed email addresses, never the values
-- themselves, and rows older than a day are deleted by the app.
create table public.form_throttle (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  subject text not null,
  form text not null
);
create index form_throttle_subject_created_at on public.form_throttle (subject, created_at);
create index form_throttle_created_at on public.form_throttle (created_at);
alter table public.form_throttle enable row level security;
-- No public policies. Reads and writes happen server-side with the service role key only.
