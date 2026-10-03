-- Politiques RLS pour app_server (uniquement ce que les droits autorisent)
-- Ces politiques permettent au rôle app_server d'accéder aux tables selon ses droits SQL

create policy app_server_all on public.gifts for all to app_server using (true) with check (true);
create policy app_server_all on public.gift_blocks for all to app_server using (true) with check (true);
create policy app_server_all on public.assets for all to app_server using (true) with check (true);
create policy app_server_all on public.contributors for all to app_server using (true) with check (true);
create policy app_server_all on public.contributions for all to app_server using (true) with check (true);
create policy app_server_all on public.reactions for all to app_server using (true) with check (true);
create policy app_server_select on public.payments for all to app_server using (true);
create policy app_server_insert on public.payments for all to app_server using (true) with check (true);
create policy app_server_update on public.payments for all to app_server using (true) with check (true);
create policy app_server_select on public.webhook_events for all to app_server using (true);
create policy app_server_insert on public.webhook_events for all to app_server using (true) with check (true);
create policy app_server_select on public.daily_stats for all to app_server using (true);
create policy app_server_insert on public.daily_stats for all to app_server using (true) with check (true);
create policy app_server_update on public.daily_stats for all to app_server using (true) with check (true);
create policy app_server_select on public.gift_events for all to app_server using (true);
create policy app_server_insert on public.gift_events for all to app_server using (true) with check (true);
create policy app_server_select on public.abuse_reports for all to app_server using (true);
create policy app_server_insert on public.abuse_reports for all to app_server using (true) with check (true);
create policy app_server_select on public.audit_log for all to app_server using (true);
create policy app_server_insert on public.audit_log for all to app_server using (true) with check (true);
create policy app_server_select on public.music_tracks for all to app_server using (true);
