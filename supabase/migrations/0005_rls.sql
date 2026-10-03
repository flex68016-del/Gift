-- RLS : refus par défaut sur toutes les tables
alter table public.gifts          enable row level security;
alter table public.gift_blocks    enable row level security;
alter table public.assets         enable row level security;
alter table public.music_tracks   enable row level security;
alter table public.payments       enable row level security;
alter table public.webhook_events enable row level security;
alter table public.contributors   enable row level security;
alter table public.contributions  enable row level security;
alter table public.reactions      enable row level security;
alter table public.gift_events    enable row level security;
alter table public.gift_events_default enable row level security;
alter table public.daily_stats    enable row level security;
alter table public.abuse_reports  enable row level security;

-- Aucune politique de lecture ou d'écriture publique, y compris pour music_tracks
-- Aucune politique admin : l'administration passe par le serveur (session admin + MFA + audit_log)
