-- Fonctions SQL (security definer, search_path vide)

create or replace function public.record_open(gift_id uuid) returns boolean
language plpgsql set search_path = '' as $$
declare
  is_first boolean;
begin
  update public.gifts
  set first_opened_at = now(), open_count = open_count + 1
  where id = gift_id and first_opened_at is null;
  
  select (first_opened_at is not null) into is_first
  from public.gifts
  where id = gift_id;
  
  return is_first;
end $$;

create or replace function public.publish_gift(gift_id uuid, retention_years int)
language plpgsql set search_path = '' as $$
begin
  update public.gifts
  set status = 'published',
      published_at = now(),
      expires_at = now() + (retention_years || 5) * interval '1 year'
  where id = gift_id and status = 'pending_payment';
end $$;

create or replace function public.maintain_partitions()
language plpgsql set search_path = '' as $$
declare
  start_date date;
  i integer;
begin
  start_date := date_trunc('month', current_date);
  for i in 0..2 loop
    begin
      execute format(
        'create table if not exists public.gift_events_%s partition of public.gift_events for values from (%L) to (%L)',
        to_char(start_date + (i || ' month')::interval, 'YYYY_MM'),
        start_date + (i || ' month')::interval,
        start_date + ((i + 1) || ' month')::interval
      );
    exception when duplicate_table then null;
    end;
  end loop;
end $$;

create or replace function public.purge_old_events(days int)
language plpgsql set search_path = '' as $$
declare
  partition_name text;
  cutoff_date date;
begin
  cutoff_date := current_date - days * interval '1 day';
  
  for partition_name in
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name like 'gift_events_%'
      and table_name < 'gift_events_' || to_char(cutoff_date, 'YYYY_MM')
  loop
    execute format('drop table if exists public.%s cascade', partition_name);
  end loop;
  
  -- Purge webhook_events
  delete from public.webhook_events where created_at < cutoff_date;
end $$;

-- Grant execute on functions to app_server
grant execute on function public.record_open(uuid), public.publish_gift(uuid, integer), public.maintain_partitions(), public.purge_old_events(integer) to app_server;
