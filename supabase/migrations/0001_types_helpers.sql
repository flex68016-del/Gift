-- Extensions
create extension if not exists pgcrypto;

-- Types
create type gift_status as enum ('draft','pending_payment','published','expired','suspended','deleted');
create type unlock_kind as enum ('immediate','secret','scheduled');
create type block_type as enum ('letter','gallery','voice','timeline','counter','quiz','reveal','music','wall','video');
create type asset_kind as enum ('image','audio','video');
create type asset_status as enum ('pending','processing','ready','rejected');
create type payment_status as enum ('pending','approved','declined','canceled','refunded');
create type reaction_kind as enum ('emoji','text','voice');
create type moderation_status as enum ('pending','approved','rejected');

-- Helpers
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;
