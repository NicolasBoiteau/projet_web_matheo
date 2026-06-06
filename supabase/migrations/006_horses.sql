-- Create horses table for direct Supabase management (no Sanity dependency)
CREATE TABLE horses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  breed             TEXT,
  gender            TEXT CHECK (gender IN ('male', 'female', 'gelding')),
  birth_year        INT,
  height_cm         INT,
  color             TEXT,
  disciplines       TEXT[] DEFAULT '{}',
  description       TEXT,
  main_image_url    TEXT,
  gallery_urls      TEXT[] DEFAULT '{}',
  pedigree          TEXT,
  competition_level TEXT,
  is_for_sale       BOOLEAN NOT NULL DEFAULT false,
  sale_price_cents  INT,
  featured          BOOLEAN NOT NULL DEFAULT false,
  is_published      BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_horses_slug ON horses(slug);
CREATE INDEX idx_horses_for_sale ON horses(is_for_sale) WHERE is_for_sale = true;
CREATE INDEX idx_horses_featured ON horses(featured) WHERE featured = true;

-- RLS
ALTER TABLE horses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published horses"
  ON horses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can read all horses"
  ON horses FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert horses"
  ON horses FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update horses"
  ON horses FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete horses"
  ON horses FOR DELETE
  USING (public.is_admin());