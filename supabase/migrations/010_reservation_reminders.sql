-- 010 : suivi de l'envoi du rappel "la veille" (cron Vercel).
-- Évite d'envoyer plusieurs fois le même rappel à un membre.

alter table reservations
  add column if not exists reminder_sent_at timestamptz;

-- Index pour la requête du cron (créneaux à venir non encore rappelés).
create index if not exists idx_reservations_reminder
  on reservations (reminder_sent_at);
