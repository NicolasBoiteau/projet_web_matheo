-- 014 : Concours (compétitions) + palmarès.
-- Page publique /concours : prochains concours et résultats passés avec podium.
-- Gérés par l'équipe (admins + moniteurs) via is_staff() (migration 011).

create table if not exists public.concours (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  discipline   text,                      -- ex. CSO, Dressage, CCE, Hunter…
  event_date   date not null,             -- sert à trier « à venir » / « passés »
  location     text,
  level        text,                      -- ex. Club 1, Amateur, Pro…
  description  text,
  -- Podium structuré : tableau JSON [{ "rank": 1, "rider": "…", "horse": "…" }, …]
  podium       jsonb not null default '[]'::jsonb,
  image_url    text,
  is_featured  boolean not null default false,
  is_published boolean not null default true,
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists concours_event_date_idx on public.concours (event_date desc);
create index if not exists concours_published_idx on public.concours (is_published);

alter table public.concours enable row level security;

-- Lecture publique des concours publiés.
drop policy if exists "Public can read published concours" on public.concours;
create policy "Public can read published concours"
  on public.concours for select
  using (is_published = true);

-- L'équipe (admins + moniteurs) gère tout (lecture incluse, même non publié).
drop policy if exists "Staff can manage concours" on public.concours;
create policy "Staff can manage concours"
  on public.concours for all
  using (public.is_staff())
  with check (public.is_staff());

-- Quelques exemples de démo (modifiables / supprimables depuis le back-office).
insert into public.concours (name, discipline, event_date, location, level, description, podium, is_featured)
values
  (
    'Grand Prix de Printemps', 'CSO', current_date + 21, 'Avrainville (91)', 'Amateur',
    'Concours de saut d''obstacles ouvert aux cavaliers du club et invités.',
    '[]'::jsonb, true
  ),
  (
    'Challenge Dressage Inter-Clubs', 'Dressage', current_date + 45, 'Étampes (91)', 'Club 1',
    'Reprises Club et Amateur, jugées par un jury fédéral.',
    '[]'::jsonb, false
  ),
  (
    'Concours d''Automne O''TAKEY', 'CSO', current_date - 30, 'Avrainville (91)', 'Amateur',
    'Belle journée de concours à domicile, podium 100% écuries du O''TAKEY.',
    '[{"rank":1,"rider":"Léa Martin","horse":"Uranus du Vent"},{"rank":2,"rider":"Hugo Bernard","horse":"Vegas de la Plaine"},{"rank":3,"rider":"Camille Petit","horse":"Quibelle d''Or"}]'::jsonb,
    true
  ),
  (
    'Trophée CCE Régional', 'CCE', current_date - 70, 'Fontainebleau (77)', 'Pro',
    'Concours complet d''équitation : dressage, cross et obstacles.',
    '[{"rank":1,"rider":"Camille Petit","horse":"Sultan des Bois"},{"rank":2,"rider":"Léa Martin","horse":"Tornade"}]'::jsonb,
    false
  );
