-- Supabase advisory fix: public.rls_auto_enable() is a pre-existing
-- Supabase-provisioned event trigger function (auto-enables RLS on new
-- tables in the public schema). It was flagged by the security advisor
-- because EXECUTE was granted to PUBLIC, making it directly callable via
-- PostgREST RPC by anon/authenticated roles. Event triggers fire via
-- Postgres's internal DDL dispatch, not via a caller's EXECUTE grant on
-- the trigger function, so revoking EXECUTE here does not affect the
-- automatic RLS-enable behavior on new tables - it only closes the
-- unnecessary RPC-callable surface.
revoke execute on function public.rls_auto_enable() from public;
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
