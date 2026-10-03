-- Journal d'audit (ajout seul ; jamais exposé)
create table public.audit_log (
  id        bigint generated always as identity primary key,
  at        timestamptz not null default now(),
  actor     text not null,
  action    text not null,
  gift_id   uuid,
  meta      jsonb not null default '{}'
);
alter table public.audit_log enable row level security;

create or replace function public.audit_log_immutable() returns trigger
language plpgsql set search_path = '' as $$
begin
  raise exception 'audit_log est en ajout seul';
end $$;
create trigger audit_log_no_update before update or delete on public.audit_log
  for each row execute function public.audit_log_immutable();

-- Colonnes immuables
create or replace function public.gifts_protect_immutable() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.id <> old.id or new.slug <> old.slug or new.created_at <> old.created_at then
    raise exception 'colonne immuable';
  end if;
  return new;
end $$;
create trigger gifts_immutable before update on public.gifts
  for each row execute function public.gifts_protect_immutable();

-- Durcissement des privilèges (en plus de la RLS)
alter table public.gifts          force row level security;
alter table public.gift_blocks    force row level security;
alter table public.assets         force row level security;
alter table public.music_tracks   force row level security;
alter table public.payments       force row level security;
alter table public.webhook_events force row level security;
alter table public.contributors   force row level security;
alter table public.contributions  force row level security;
alter table public.reactions      force row level security;
alter table public.gift_events    force row level security;
alter table public.gift_events_default force row level security;
alter table public.daily_stats    force row level security;
alter table public.abuse_reports  force row level security;
alter table public.audit_log      force row level security;

revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;
alter default privileges in schema public revoke all on tables    from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- Rôle applicatif à privilèges minimaux (remplace service_role pour tous les accès base)
-- Le mot de passe est défini hors migration (jamais dans le dépôt) et stocké dans DATABASE_URL
create role app_server login nobypassrls nosuperuser nocreatedb nocreaterole;
grant usage on schema public to app_server;

-- Droits table par table (matrice complète dans docs/DB-PRIVILEGES.md)
grant select, insert, update, delete on public.gifts, public.gift_blocks, public.assets,
  public.contributors, public.contributions, public.reactions to app_server;
grant select, insert, update on public.payments, public.webhook_events, public.daily_stats to app_server;
grant select, insert on public.gift_events, public.abuse_reports, public.audit_log to app_server;
grant update (handled_at) on public.abuse_reports to app_server;
grant select on public.music_tracks to app_server;
grant usage, select on all sequences in schema public to app_server;
