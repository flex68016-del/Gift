-- Bibliothèque musicale
create table public.music_tracks (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  artist        text not null,
  license       text not null,
  storage_path  text not null,
  duration_ms   integer not null,
  bpm           numeric(5,2),
  beat_map      jsonb,
  mood          text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Paiements
create table public.payments (
  id              uuid primary key default gen_random_uuid(),
  gift_id         uuid not null references public.gifts(id) on delete restrict,
  provider        text not null,
  provider_ref    text,
  amount          integer not null,
  currency        text not null default 'XOF',
  plan            text not null,
  status          payment_status not null default 'pending',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create unique index payments_provider_ref_uidx on public.payments(provider, provider_ref)
  where provider_ref is not null;
create trigger payments_updated before update on public.payments
  for each row execute function public.set_updated_at();

-- Webhooks
create table public.webhook_events (
  id            uuid primary key default gen_random_uuid(),
  provider      text not null,
  event_id      text not null,
  payload       jsonb not null,
  processed_at  timestamptz,
  created_at    timestamptz not null default now(),
  unique (provider, event_id)
);
