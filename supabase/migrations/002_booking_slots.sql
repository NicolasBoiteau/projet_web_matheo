-- Create booking slots table
CREATE TABLE booking_slots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_type       TEXT NOT NULL CHECK (slot_type IN ('lesson', 'clinic', 'arena_rental')),
  title           TEXT NOT NULL,
  description     TEXT,
  instructor_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  start_time      TIMESTAMPTZ NOT NULL,
  end_time        TIMESTAMPTZ NOT NULL,
  max_participants INT NOT NULL DEFAULT 1,
  price_cents     INT NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'eur',
  is_recurring    BOOLEAN NOT NULL DEFAULT false,
  recurring_rule  TEXT,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE booking_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read slots"
  ON booking_slots FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage slots"
  ON booking_slots FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));