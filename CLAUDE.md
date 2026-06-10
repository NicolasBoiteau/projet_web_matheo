# Projet O'TAKEY — Centre Équestre

Site web pour un **vrai centre équestre** (cadeau / coup de main). Maintenu en continu par le propriétaire du repo.

## Décisions produit (importantes)

- **Backend = Supabase uniquement.** Sanity a été **entièrement retiré** (dépendances `@sanity/*`/`next-sanity`/`groq` désinstallées, dossier `/src/lib/sanity/` supprimé).
- **Pas de paiement en ligne** (volontaire). Le règlement se fait **sur place**. Stripe a été **supprimé** ; les colonnes Stripe et la facturation ont été **retirées de la base** par la migration `013` (`reservations.stripe_*`/`paid_at`, `profiles.stripe_customer_id`, tables `invoices`/`payments`).
- **Réservation = modèle « créneaux publiés »** : l'admin publie des créneaux (`booking_slots`), le membre s'inscrit (`reservations`, statut `pending` → l'admin confirme). L'inscription passe par la **fonction Postgres atomique `create_reservation`** (migration `012`) qui verrouille le créneau et contrôle la capacité dans une seule transaction (anti-surbooking).
- **Factures retirées** (onglet membre supprimé). Migrations `004`/`005` historiques ; les tables qu'elles créaient sont supprimées par `013`.

## Stack

- **Framework** : Next.js 16.2.6 (App Router, Turbopack), React 19.2.4, TypeScript 5
- **CSS** : Tailwind CSS v4 (thème : `--color-gold`, `--color-fir`, `--color-cream`)
- **Auth + DB + Storage** : Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Calendrier** : FullCalendar (daygrid, timegrid, interaction)
- **Forms** : React Hook Form + Zod · **Icons** : Lucide · **Anim** : Framer Motion · **State** : Zustand · **Utils** : date-fns, clsx + tailwind-merge

## Structure

### `/src/app/` — Pages

**Marketing** : `/`, `/pensions`, `/cavalerie`, `/cavalerie/[slug]`, `/chevaux-a-vendre`, `/equipe`, `/stages`, `/contact`
**Auth** : `/login`, `/register` (vrais appels Supabase)
**Réservation** : `/reservation` (créneaux publiés, sans paiement), `/reservation/confirmation`
**Membre** (protégé, `/membre/*`) : `/membre/dashboard`, `/membre/planning` (FullCalendar), `/membre/parametres`
**Admin** (protégé, rôle `admin`, `/admin/*`) :
- `/admin` — tableau de bord (compteurs chevaux + réservations)
- `/admin/chevaux`, `/admin/chevaux/nouveau`, `/admin/chevaux/[id]`
- `/admin/creneaux`, `/admin/creneaux/nouveau`, `/admin/creneaux/[id]`
- `/admin/reservations` — gestion du statut des inscriptions
- `/admin/contenu`, `/admin/contenu/[type]`, `/admin/contenu/[type]/nouveau`, `/admin/contenu/[type]/[id]` — CMS générique (pensions, équipe, stages, services/stats/témoignages d'accueil)

**API** :
- `/api/contact` (POST), `/api/alert` (GET), `/api/revalidate` (POST)
- `/api/admin/setup` (GET, crée le 1er admin via secret)
- `/api/horses` (GET/POST admin), `/api/horses/[id]` (GET/PUT/DELETE admin)
- `/api/slots` (POST admin), `/api/slots/[id]` (PUT/DELETE admin)
- `/api/reservations` (POST membre + contrôle de capacité), `/api/reservations/[id]` (PATCH statut : admin tout, membre annulation)
- `/api/cms/[type]` (POST admin), `/api/cms/[type]/[id]` (PUT/DELETE admin) — CMS générique, `type` ∈ pensions/equipe/stages/services/stats/temoignages

### `/src/components/`

- `ui/` — Button, Card, Badge · `shared/` — SectionTitle, AnimatedSection, LoadingSpinner, EmptyState
- `layout/` — Navbar, Footer (les deux se **masquent sur `/admin`**), AlertBanner
- `home/` — Hero, ServicesGrid, StatsCounter, TestimonialsCarousel, CTASection
- `horses/` — HorseCard, HorseFilters, HorseGrid, **HorseDetail**
- `booking/` — **BookingForm** (slot-based), BookingCalendar, **MemberPlanning**, **MyReservations**
- `marketing/` — **PensionsView, EquipeView, StagesView** (vues client alimentées par le CMS)
- `admin/` — AdminSidebar, HorseForm, HorsesTable, ImageUpload, **SlotForm**, **SlotsTable**, **ReservationsTable**, **CmsForm, CmsTable** (génériques)

### `/src/lib/`

- `supabase/client.ts` (navigateur), `supabase/server.ts` (server, cookies), `supabase/admin.ts` (service_role, server-only), `supabase/types.ts` (Horse, BookingSlot, Reservation, Profile…)
- `horses.ts` — helpers **purs** (mapper Supabase→UI, `isSupabaseConfigured`, `frenchGender`) · `horses.server.ts` — fetchers serveur
- `bookings.ts` — helpers **purs** (labels, statuts, events FullCalendar) · `bookings.server.ts` — fetchers serveur (dispo, capacité, résas)
- `content.ts` — données de repli (mock) · `content.server.ts` — fetchers CMS (publié + admin, fallback mock) · `cms.ts` — config générique (tables, champs, métadonnées UI)
- `utils/` — cn, constants (`SITE_CONFIG`, `PENSION_PACKS`), formatters, validators (Zod)
- `email.ts` — emails transactionnels Resend (confirmation, rappel veille, confirmation/annulation admin) ; no-op sans `RESEND_API_KEY`
- `avatar.ts` — avatars DiceBear déterministes

> ⚠️ Règle Next : un composant client ne doit jamais importer un module qui pull `next/headers`. D'où la séparation `*.ts` (pur) vs `*.server.ts` (serveur).

### Tests
Vitest (`npm test`). Tests unitaires sur les **helpers purs** : `bookings.test.ts` (dont `computeRemaining`, la logique de capacité), `utils/validators.test.ts` (schémas Zod), `horses.test.ts` (mappers). Convention : `*.test.ts` à côté du module testé.

### `/src/middleware.ts`
Protège `/membre/*` et `/admin/*` (ce dernier exige le rôle `admin`). **Passe-plat** si les variables Supabase sont absentes/placeholder (dev sans backend). Les pages serveur dégradent aussi gracieusement (retournent vide au lieu de planter).

### `/supabase/` — Base de données (migrations dans l'ordre)

| # | Table / objet | Note |
|---|---|---|
| 001 | `profiles` (rôle admin/member) + **fonction `is_admin()` `SECURITY DEFINER`** | la fonction évite la récursion RLS ; trigger `handle_new_user` crée le profil |
| 002 | `booking_slots` | créneaux (lesson/clinic/arena_rental) |
| 003 | `reservations` | inscriptions (pending/confirmed/cancelled/completed/no_show) |
| 004 | `invoices` | historique — **table supprimée par `013`** |
| 005 | `payments` | historique — **table supprimée par `013`** |
| 006 | `horses` | cavalerie gérée directement dans Supabase |
| 007 | bucket Storage `horse-images` (public, écriture admin) | |
| 008 | retrait de la contrainte `no_overlap` sur `booking_slots` | autorise des activités en parallèle |
| 009 | CMS : `pension_packs`, `team_members`, `events`, `home_services`, `home_stats`, `testimonials` | + seed du contenu mock d'origine |
| 010 | `reservations.reminder_sent_at` | anti-doublon pour le rappel email veille (cron) |
| 011 | rôle `instructor` (moniteur) | étend le CHECK de `profiles.role` + RLS slots pour les moniteurs |
| 012 | **fonction `create_reservation()` atomique** | verrou de ligne + contrôle de capacité dans une transaction (anti-surbooking) |
| 013 | cleanup Stripe/facturation | drop colonnes `stripe_*`/`paid_at` + tables `invoices`/`payments` |
| 014 | **`concours`** (compétitions + palmarès) | podium structuré `jsonb` ; RLS lecture publique (publié) + écriture équipe via `is_staff()` — gérable par admins **et** moniteurs |

RLS partout via `is_admin()` (admins gèrent tout, membres leurs propres données, lecture publique des chevaux publiés et des créneaux).
`seed.sql` — créneaux de réservation de démo.

## Mise en route (prérequis pour que tout fonctionne)

1. Créer un projet Supabase, mettre les vraies clés dans `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
2. Exécuter les migrations **`001` → `014`** dans l'ordre (la fonction `is_admin()` de `001` est utilisée par `006`/`007` ; `011` ajoute `is_staff()` utilisée par `014` ; `012` ajoute la réservation atomique, `013` nettoie Stripe/facturation, `014` ajoute les concours).
3. (Optionnel) `seed.sql` pour des créneaux de démo.
4. Définir `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_SETUP_SECRET`, puis appeler une fois `/api/admin/setup?secret=...` pour créer le compte admin.
5. Se connecter sur `/login` → accès à `/admin`.

Sans config Supabase, l'app tourne quand même (pages publiques affichées, contenus vides, `/admin` redirige vers `/login`).

## Contenu éditable (CMS)

Tous les contenus marketing sont désormais **éditables depuis `/admin/contenu`** et lus depuis Supabase, avec **repli sur les données mock** (`src/lib/content.ts`) tant que Supabase n'est pas configuré — le site reste donc identique sans backend :

| Page / zone | Source |
|------|-------------|
| `/pensions` | table `pension_packs` |
| `/equipe` | table `team_members` |
| `/stages` | table `events` |
| Accueil — services / stats / témoignages | `home_services` / `home_stats` / `testimonials` |

> `PENSION_PACKS` reste dans `constants.ts` mais n'est plus utilisé par la page (remplacé par le CMS).

## Points d'attention

1. **Next.js 16** — APIs/conventions récentes ; en cas de doute, consulter `node_modules/next/dist/...`.
2. **Promesse `params`** — les routes dynamiques reçoivent `params: Promise<…>` (à `await`).
3. **Création admin** — via `/api/admin/setup` (le trigger crée le profil, le endpoint le passe `admin`). Pour promouvoir un compte existant : `UPDATE profiles SET role='admin' WHERE email='…';` puis reconnexion.
4. **Images** — `next.config.ts` autorise `*.supabase.co` (Storage) et `images.unsplash.com`.
5. **Réservation atomique** — l'API `/api/reservations` (POST) appelle la RPC `create_reservation` ; ne jamais revenir à un `insert` direct sans contrôle de capacité (risque de surbooking).
