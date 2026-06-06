-- Create payments table
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reservation_id  UUID REFERENCES reservations(id) ON DELETE SET NULL,
  invoice_id      UUID REFERENCES invoices(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  amount_cents    INT NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'eur',
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  fee_cents       INT,
  payment_method  JSONB,
  receipt_url     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_id ON payments(stripe_payment_intent_id);

-- RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all payments"
  ON payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));