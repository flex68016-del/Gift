-- Pistes musicales de test
insert into public.music_tracks (title, artist, license, storage_path, duration_ms, bpm, mood, is_active)
values
  ('Sunrise', 'Test Artist', 'CC0 1.0 Universal', 'test/sunrise.mp3', 180000, 120.0, 'peaceful', true),
  ('Celebration', 'Test Artist', 'CC0 1.0 Universal', 'test/celebration.mp3', 150000, 128.0, 'happy', true),
  ('Romance', 'Test Artist', 'CC0 1.0 Universal', 'test/romance.mp3', 200000, 90.0, 'romantic', true);
