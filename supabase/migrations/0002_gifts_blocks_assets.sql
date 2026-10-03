-- Cadeaux
create table public.gifts (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  edit_token_hash   text not null,
  theme_key         text not null,
  theme_options     jsonb not null default '{}',
  locale            text not null default 'fr',
  status            gift_status not null default 'draft',
  sender_name       text not null,
  sender_email_enc  text,
  sender_email_hmac text,
  recipient_name    text,
  title             text,
  unlock_kind       unlock_kind not null default 'immediate',
  unlock_at         timestamptz,
  secret_hash       text,
  secret_hint       text,
  music             jsonb,
  plan              text not null default 'standard',
  is_collective     boolean not null default false,
  contribution_deadline timestamptz,
  first_opened_at   timestamptz,
  open_count        integer not null default 0,
  published_at      timestamptz,
  expires_at        timestamptz,
  deleted_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint chk_scheduled check (unlock_kind <> 'scheduled' or unlock_at is not null),
  constraint chk_secret check (unlock_kind <> 'secret' or secret_hash is not null)
);
create index gifts_status_idx on public.gifts(status);
create index gifts_expires_idx on public.gifts(expires_at) where status = 'published';
create index gifts_email_hmac_idx on public.gifts(sender_email_hmac) where sender_email_hmac is not null;
create trigger gifts_updated before update on public.gifts
  for each row execute function public.set_updated_at();

-- Blocs
create table public.gift_blocks (
  id          uuid primary key default gen_random_uuid(),
  gift_id     uuid not null references public.gifts(id) on delete cascade,
  type        block_type not null,
  position    integer not null,
  config      jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (gift_id, position) deferrable initially deferred
);
create index gift_blocks_gift_idx on public.gift_blocks(gift_id);
create trigger gift_blocks_updated before update on public.gift_blocks
  for each row execute function public.set_updated_at();

-- Fichiers
create table public.assets (
  id            uuid primary key default gen_random_uuid(),
  gift_id       uuid not null references public.gifts(id) on delete cascade,
  kind          asset_kind not null,
  storage_path  text not null unique,
  thumb_path    text,
  mime_type     text not null,
  size_bytes    integer not null,
  width         integer,
  height        integer,
  duration_ms   integer,
  status        asset_status not null default 'pending',
  created_at    timestamptz not null default now()
);
create index assets_gift_idx on public.assets(gift_id);
