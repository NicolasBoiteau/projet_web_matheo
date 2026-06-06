-- Seed data for development
-- Note: This is meant to be run after the Supabase project is set up

-- Sample booking slots
INSERT INTO booking_slots (slot_type, title, start_time, end_time, max_participants, price_cents)
VALUES
  ('lesson', 'Cours CSO - Camille', '2026-06-15 14:00:00+02', '2026-06-15 15:30:00+02', 1, 5000),
  ('lesson', 'Cours CCE - Thomas', '2026-06-16 10:00:00+02', '2026-06-16 11:30:00+02', 1, 5000),
  ('clinic', 'Stage CSO Perfectionnement', '2026-06-22 09:00:00+02', '2026-06-22 17:00:00+02', 6, 25000),
  ('arena_rental', 'Location carrière', '2026-06-18 14:00:00+02', '2026-06-18 16:00:00+02', 1, 3000);