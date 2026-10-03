-- Collectif (V1.1)
create table public.contributors (
  id                 uuid primary key default gen_random_uuid(),
  gift_id            uuid not null references public.gifts(id) on delete cascade,
  invite_token_hash  text not null unique,
  display_name       text,
  created_at         timestamptz not null default now()
);

create table public.contributions (
  id             uuid primary key default gen_random_uuid(),
  gift_id        uuid not null references public.gifts(id) on delete cascade,
  contributor_id uuid not null references public.contributors(id) on delete cascade,
  kind           text not null check (kind in ('text','photo','voice')),
  content        jsonb not null default '{}',
  asset_id       uuid references public.assets(id) on delete set null,
  moderation     moderation_status not null default 'pending',
  created_at     timestamptz not null default now()
);

-- Réactions, événements, signalements
create table public.reactions (
  id          uuid primary key default gen_random_uuid(),
  gift_id     uuid not null references public.gifts(id) on delete cascade,
  kind        reaction_kind not null,
  content     text,
  asset_id    uuid references public.assets(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Table à forte croissance : partitionnée par mois
create table public.gift_events (
  id          uuid not null default gen_random_uuid(),
  gift_id     uuid not null references public.gifts(id) on delete cascade,
  type        text not null check (type in ('opened','unlocked','block_viewed','completed')),
  meta        jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  primary key (id, created_at)
) partition by range (created_at);
create table public.gift_events_default partition of public.gift_events default;
create index gift_events_gift_idx on public.gift_events (gift_id, created_at);

-- Statistiques agrégées
create table public.daily_stats (
  day              date primary key,
  gifts_created    integer not null default 0,
  gifts_published  integer not null default 0,
  opens            integer not null default 0,
  completions      integer not null default 0
);

create table public.abuse_reports (
  id          uuid primary key default gen_random_uuid(),
  gift_id     uuid not null references public.gifts(id) on delete cascade,
  reason      text not null,
  created_at  timestamptz not null default now(),
  handled_at  timestamptz
);
