DROP SCHEMA IF EXISTS cron_functions CASCADE;
CREATE SCHEMA cron_functions;

create or replace function cron_functions.mark_user_space_offline()
returns void
language plpgsql
security definer
as $$
begin
  update public.user_space_presences
  set status = 'OFFLINE'
  where last_seen_at < now() - interval '30 seconds';
end;
$$;
