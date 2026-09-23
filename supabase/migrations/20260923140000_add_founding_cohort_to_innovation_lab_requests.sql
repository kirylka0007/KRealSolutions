-- Applicants can ask to be considered for the Founding Practitioner Cohort.
-- Additive with a default, so existing rows read "no" and the form keeps working
-- whether this runs before or after the code that writes it. No new grants: the
-- column inherits the table's, and inserts stay server-side with the service role.
alter table public.innovation_lab_requests
  add column founding_cohort boolean not null default false;

comment on column public.innovation_lab_requests.founding_cohort is
  'Applicant ticked "consider me for the Founding Practitioner Cohort" on the Innovation Lab access form.';
