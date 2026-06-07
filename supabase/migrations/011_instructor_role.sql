-- 011 : rôle « moniteur » (instructor).
-- Un moniteur peut créer et gérer des créneaux (cours) sans être administrateur.
-- L'admin reste le seul à gérer chevaux, contenu, réservations et rôles.

-- 1. Autoriser la nouvelle valeur de rôle.
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles
  add constraint profiles_role_check check (role in ('admin', 'member', 'instructor'));

-- 2. Helper : l'utilisateur courant fait-il partie de l'équipe (admin OU moniteur) ?
--    SECURITY DEFINER => contourne la RLS (même logique que is_admin()).
create or replace function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'instructor')
  );
$$ language sql security definer stable set search_path = public;

-- 3. Les créneaux sont désormais gérés par l'équipe (admins + moniteurs).
drop policy if exists "Admins can manage slots" on booking_slots;
create policy "Staff can manage slots"
  on booking_slots for all
  using (public.is_staff());

-- 4. L'admin peut modifier le rôle de n'importe quel profil (page « Membres »).
--    (La mise à jour passe aussi par le service_role côté API, mais cette policy
--     garde l'accès cohérent si on requête en tant qu'admin connecté.)
drop policy if exists "Admins can update all profiles" on profiles;
create policy "Admins can update all profiles"
  on profiles for update
  using (public.is_admin());
