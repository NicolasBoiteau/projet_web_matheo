-- Create invoices table
CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invoice_number  TEXT NOT NULL UNIQUE,
  invoice_type    TEXT NOT NULL CHECK (invoice_type IN ('pension', 'lesson', 'clinic', 'sale')),
  line_items      JSONB NOT NULL,
  subtotal_cents  INT NOT NULL,
  tax_cents       INT NOT NULL DEFAULT 0,
  total_cents     INT NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'eur',
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  stripe_invoice_id TEXT,
  due_date        DATE NOT NULL,
  paid_at         TIMESTAMPTZ,
  pdf_url         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage invoices"
  ON invoices FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));