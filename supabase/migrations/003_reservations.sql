-- Create reservations table
CREATE TABLE reservations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slot_id               UUID NOT NULL REFERENCES booking_slots(id) ON DELETE RESTRICT,
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  participants          INT NOT NULL DEFAULT 1,
  notes                 TEXT,
  stripe_session_id     TEXT,
  stripe_payment_intent_id TEXT,
  amount_cents          INT NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'eur',
  paid_at               TIMESTAMPTZ,
  cancelled_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_slot_id ON reservations(slot_id);
CREATE INDEX idx_reservations_status ON reservations(status);

-- RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reservations"
  ON reservations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reservations"
  ON reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reservations"
  ON reservations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reservations"
  ON reservations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));