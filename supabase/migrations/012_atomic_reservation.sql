-- Réservation atomique : évite le surbooking en cas de demandes concurrentes.
--
-- Problème résolu : l'API faisait « lire les places restantes » puis « insérer »
-- en deux étapes séparées. Deux membres réservant la dernière place au même
-- instant passaient tous les deux le contrôle → surbooking.
--
-- Cette fonction verrouille la ligne du créneau (FOR UPDATE) le temps de la
-- transaction : les réservations concurrentes sur un même créneau sont donc
-- sérialisées et le contrôle de capacité devient fiable.
--
-- SECURITY DEFINER : nécessaire pour additionner les `participants` des
-- réservations des AUTRES membres (interdit par les RLS à un membre). Comme la
-- fonction lit `auth.uid()`, l'insertion reste forcément liée à l'appelant.

CREATE OR REPLACE FUNCTION create_reservation(
  p_slot_id      UUID,
  p_participants INT,
  p_notes        TEXT DEFAULT NULL
)
RETURNS reservations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid  UUID := auth.uid();
  v_slot booking_slots;
  v_used INT;
  v_new  reservations;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '28000';
  END IF;

  IF p_participants IS NULL OR p_participants < 1 THEN
    p_participants := 1;
  END IF;

  -- Verrou de ligne : sérialise les réservations concurrentes sur ce créneau.
  SELECT * INTO v_slot FROM booking_slots WHERE id = p_slot_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'slot_not_found' USING ERRCODE = 'P0002';
  END IF;

  IF NOT v_slot.is_available OR v_slot.start_time < now() THEN
    RAISE EXCEPTION 'slot_unavailable' USING ERRCODE = 'P0001';
  END IF;

  SELECT COALESCE(SUM(participants), 0) INTO v_used
  FROM reservations
  WHERE slot_id = p_slot_id AND status IN ('pending', 'confirmed');

  IF v_used + p_participants > v_slot.max_participants THEN
    -- Le message porte le nombre de places réellement restantes.
    RAISE EXCEPTION 'slot_full:%', GREATEST(v_slot.max_participants - v_used, 0)
      USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO reservations (user_id, slot_id, status, participants, notes, amount_cents)
  VALUES (v_uid, p_slot_id, 'pending', p_participants, p_notes,
          v_slot.price_cents * p_participants)
  RETURNING * INTO v_new;

  RETURN v_new;
END;
$$;

GRANT EXECUTE ON FUNCTION create_reservation(UUID, INT, TEXT) TO authenticated;
