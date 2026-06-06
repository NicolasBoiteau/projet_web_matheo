-- Contenus éditables depuis l'admin (remplacent les données mock en dur).
-- Chaque table : lecture publique (publiés), écriture admin via is_admin().
-- Les INSERT en fin de fichier reprennent le contenu mock pour que le site
-- reste identique immédiatement après migration.

-- ============ PENSIONS ============
CREATE TABLE pension_packs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  price_cents  INT NOT NULL DEFAULT 0,
  features     TEXT[] NOT NULL DEFAULT '{}',
  is_featured  BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ ÉQUIPE ============
CREATE TABLE team_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  role         TEXT,
  bio          TEXT,
  specialties  TEXT[] NOT NULL DEFAULT '{}',
  diplomas     TEXT[] NOT NULL DEFAULT '{}',
  email        TEXT,
  phone        TEXT,
  portrait_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ STAGES / ÉVÉNEMENTS ============
CREATE TABLE events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  date_label   TEXT,
  time_label   TEXT,
  instructor   TEXT,
  level        TEXT,
  places       INT,
  price_cents  INT NOT NULL DEFAULT 0,
  location     TEXT DEFAULT 'Avrainville',
  is_featured  BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ ACCUEIL : SERVICES ============
CREATE TABLE home_services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon        TEXT,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ ACCUEIL : STATISTIQUES ============
CREATE TABLE home_stats (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value      INT NOT NULL DEFAULT 0,
  suffix     TEXT NOT NULL DEFAULT '',
  label      TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ ACCUEIL : TÉMOIGNAGES ============
CREATE TABLE testimonials (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author       TEXT NOT NULL,
  context      TEXT,
  content      TEXT NOT NULL,
  rating       INT NOT NULL DEFAULT 5,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ RLS ============
ALTER TABLE pension_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_stats    ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials  ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Public read pension_packs" ON pension_packs FOR SELECT USING (true);
CREATE POLICY "Public read team_members"  ON team_members  FOR SELECT USING (is_published = true);
CREATE POLICY "Public read events"        ON events        FOR SELECT USING (is_published = true);
CREATE POLICY "Public read home_services" ON home_services FOR SELECT USING (true);
CREATE POLICY "Public read home_stats"    ON home_stats    FOR SELECT USING (true);
CREATE POLICY "Public read testimonials"  ON testimonials  FOR SELECT USING (is_published = true);

-- Lecture admin (inclut non publiés)
CREATE POLICY "Admin read team_members" ON team_members FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read events"       ON events       FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read testimonials" ON testimonials FOR SELECT USING (public.is_admin());

-- Écriture admin (toutes opérations)
CREATE POLICY "Admin write pension_packs" ON pension_packs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write team_members"  ON team_members  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write events"        ON events        FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write home_services" ON home_services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write home_stats"    ON home_stats    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write testimonials"  ON testimonials  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ SEED (contenu mock actuel) ============
INSERT INTO pension_packs (slug, name, price_cents, is_featured, sort_order, features) VALUES
('box', 'Box Premium', 65000, false, 1, ARRAY[
  'Box grande taille (4x4m)','Paille ou copeaux au choix','2 repas par jour sur-mesure',
  'Mise au paddock quotidienne','Paillage quotidien','Accès carrière et manège']),
('paddock', 'Paddock Paradise', 45000, false, 2, ARRAY[
  'Paddock individuel ou collectif','Abri et point d''eau automatique','Distribution fourrage',
  'Accès carrière et manège','Suivi nutritionnel de base','Surveillance quotidienne']),
('complet', 'Pack Compétition', 95000, true, 3, ARRAY[
  'Box Premium + Paddock','Coaching personnalisé 2x/semaine','Planning compétition sur-mesure',
  'Transport aux concours','Ostéopathe et dentiste inclus','Suivi vétérinaire prioritaire',
  'Accès illimité aux installations']);

INSERT INTO team_members (name, role, bio, specialties, diplomas, sort_order) VALUES
('Thomas Delacroix', 'Fondateur & Gérant',
 'Passionné d''équitation depuis toujours, Thomas a fondé Les Écuries du O''TAKEY avec une vision : créer un centre d''excellence où chaque cavalier peut progresser dans un cadre convivial et professionnel.',
 ARRAY['Saut d''obstacles','Concours complet','Valorisation'],
 ARRAY['BEES 1er degré','BPJEPS Équitation','FEI Level 2 Coach'], 1),
('Camille Renard', 'Coach Sportif & CSO',
 'Ancienne compétitrice de niveau international, Camille met son expérience au service des cavaliers pour les aider à atteindre leurs objectifs, du galop au parcours de CSO.',
 ARRAY['CSO','Travail à plat','Préparation concours'],
 ARRAY['BEES 2ème degré','Monitrice fédérale'], 2),
('Antoine Lefèvre', 'Responsable Écurie & Pensions',
 'Antoine assure le bien-être de chaque cheval au quotidien. Sa rigueur et son attention aux détails font de lui le garant de la qualité de nos pensions.',
 ARRAY['Soins équins','Nutrition','Gestion écurie'],
 ARRAY['Bac Pro CGEA Équin','Certificat Soins Équins'], 3);

INSERT INTO events (title, date_label, time_label, instructor, level, places, price_cents, is_featured, description, sort_order) VALUES
('Stage CSO — Perfectionnement', '15-16 Juin 2026', '9h00 - 17h00', 'Camille Renard', 'Galop 5+', 6, 25000, false,
 'Stage intensif de saut d''obstacles axé sur le perfectionnement des trajectoires et la gestion des parcours.', 1),
('Stage CCE — Préparation Concours', '22-24 Juillet 2026', '8h30 - 18h00', 'Thomas Delacroix', 'Galop 4+', 4, 48000, true,
 'Stage complet de concours complet sur 3 jours avec cross, dressage et CSO.', 2),
('Stage Dressage — Niveaux 1', '5-6 Septembre 2026', '10h00 - 16h00', 'Camille Renard', 'Galop 3-5', 8, 20000, false,
 'Initiation et perfectionnement au dressage, travail à plat, assouplissements et figures de manège.', 3);

INSERT INTO home_services (icon, title, description, sort_order) VALUES
('Building2', 'Pensions sur-mesure', 'Box premium, paddock paradise ou pack compétition — chaque cheval a son programme adapté.', 1),
('Award', 'Coaching personnalisé', 'Un suivi individuel pour progresser à votre rythme, quel que soit votre niveau.', 2),
('GraduationCap', 'Stages & intervenants', 'Des stages toute l''année avec des professionnels reconnus et des intervenants de haut niveau.', 3),
('Truck', 'Valorisation & commerce', 'Valorisation de chevaux, préparation aux concours et mise en vente accompagnée.', 4),
('ClipboardCheck', 'Suivi compétition', 'Planning sur-mesure, transport aux concours et accompagnement en compétition.', 5),
('Rabbit', 'Installations pro', 'Carrière, manège, paddocks, boxes grandes tailles — des équipements haut de gamme.', 6);

INSERT INTO home_stats (value, suffix, label, sort_order) VALUES
(30, '+', 'Chevaux en pension', 1),
(15, '+', 'Années d''expérience', 2),
(500, '+', 'Cavaliers formés', 3),
(10, ' ha', 'D''installations', 4);

INSERT INTO testimonials (author, context, content, rating, sort_order) VALUES
('Sophie L.', 'Propriétaire de Uranus',
 'Un cadre exceptionnel et une équipe passionnée. Mon cheval s''épanouit dans sa pension et j''ai fait d''énormes progrès en coaching.', 5, 1),
('Marc D.', 'Propriétaire de Belle de Nuit',
 'Je n''aurais jamais cru trouver un tel niveau de professionnalisme. Le suivi compétition est juste incroyable, des résultats concrets dès les premiers mois.', 5, 2),
('Claire M.', 'Propriétaire de Voltaire',
 'Les installations sont magnifiques et l''ambiance est tellement conviviale. On se sent vraiment comme à la maison. Je recommande les yeux fermés !', 5, 3);
