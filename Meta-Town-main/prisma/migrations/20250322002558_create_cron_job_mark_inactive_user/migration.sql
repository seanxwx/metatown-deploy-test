do $$
begin
  if public.is_real_database() then
    drop extension if exists pg_cron;

    create extension pg_cron with schema pg_catalog;

    grant usage on schema cron to postgres;
    grant all privileges on all tables in schema cron to postgres;

    if exists (
      select 1 from cron.job where jobname = 'mark-inactive-users'
    ) then
      perform cron.unschedule('mark-inactive-users');
    end if;

    perform cron.schedule(
      'mark-inactive-users',
      '*/1 * * * *',
      'select cron_functions.mark_user_space_offline()'
    );
  end if;
end; $$; 
