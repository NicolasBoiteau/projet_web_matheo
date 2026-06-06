-- La contrainte d'origine interdisait DEUX créneaux qui se chevauchent dans le
-- temps, même de types/moniteurs différents. Trop strict pour un centre équestre
-- (cours + location + stage peuvent avoir lieu en parallèle). On la retire.
ALTER TABLE booking_slots DROP CONSTRAINT IF EXISTS no_overlap;
