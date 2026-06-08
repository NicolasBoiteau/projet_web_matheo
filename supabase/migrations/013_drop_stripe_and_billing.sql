-- Nettoyage : suppression des reliquats de paiement en ligne (Stripe) et de
-- facturation, abandonnés côté produit (le règlement se fait sur place).
--
-- Décisions actées :
--  - Pas de paiement en ligne (Stripe supprimé du code).
--  - Factures reportées (tables 004/005 jamais utilisées).
--
-- Migration idempotente (IF EXISTS partout) : sans risque même si certains
-- objets ont déjà disparu.

-- 1. Tables de facturation / paiement inutilisées (dépendent des reservations,
--    donc supprimées avant les colonnes pour éviter toute dépendance résiduelle).
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;

-- 2. Colonnes Stripe et paiement sur reservations.
ALTER TABLE reservations DROP COLUMN IF EXISTS stripe_session_id;
ALTER TABLE reservations DROP COLUMN IF EXISTS stripe_payment_intent_id;
ALTER TABLE reservations DROP COLUMN IF EXISTS paid_at;

-- 3. Colonne Stripe sur profiles.
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_customer_id;
