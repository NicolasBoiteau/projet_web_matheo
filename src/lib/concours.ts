/**
 * Helpers purs pour les concours (pas de next/headers ici → importables côté client).
 */
import type { Concours, PodiumEntry } from "@/lib/supabase/types"

/** Sépare les concours « à venir » (date ≥ aujourd'hui) et « passés ». */
export function splitConcours(list: Concours[]): {
  upcoming: Concours[]
  past: Concours[]
} {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const upcoming: Concours[] = []
  const past: Concours[] = []
  for (const c of list) {
    if (c.event_date >= today) upcoming.push(c)
    else past.push(c)
  }
  upcoming.sort((a, b) => a.event_date.localeCompare(b.event_date)) // le plus proche d'abord
  past.sort((a, b) => b.event_date.localeCompare(a.event_date)) // le plus récent d'abord
  return { upcoming, past }
}

/** Trie un podium par classement croissant (1er, 2e, 3e…). */
export function sortPodium(podium: PodiumEntry[]): PodiumEntry[] {
  return [...(podium ?? [])].sort((a, b) => a.rank - b.rank)
}

/** Libellé court d'un rang (1er / 2e / 3e…). */
export function rankLabel(rank: number): string {
  return rank === 1 ? "1er" : `${rank}e`
}

/** Nettoie un podium reçu : ne garde que les entrées avec un cavalier renseigné. */
export function cleanPodium(raw: unknown): PodiumEntry[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((e, i) => ({
      rank: Number((e as PodiumEntry)?.rank) || i + 1,
      rider: String((e as PodiumEntry)?.rider ?? "").trim(),
      horse: ((e as PodiumEntry)?.horse ?? "")?.toString().trim() || null,
    }))
    .filter((e) => e.rider.length > 0)
}

/** Construit le payload « base de données » à partir d'un corps de requête (liste blanche). */
export function buildConcoursPayload(body: Record<string, unknown>) {
  return {
    name: body.name,
    discipline: body.discipline || null,
    event_date: body.event_date,
    location: body.location || null,
    level: body.level || null,
    description: body.description || null,
    podium: cleanPodium(body.podium),
    image_url: body.image_url || null,
    is_featured: body.is_featured ?? false,
    is_published: body.is_published ?? true,
  }
}

/** Données de repli affichées tant que Supabase n'est pas configuré. */
export const FALLBACK_CONCOURS: Concours[] = [
  {
    id: "demo-1",
    name: "Grand Prix de Printemps",
    discipline: "CSO",
    event_date: new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10),
    location: "Avrainville (91)",
    level: "Amateur",
    description:
      "Concours de saut d'obstacles ouvert aux cavaliers du club et invités.",
    podium: [],
    image_url: null,
    is_featured: true,
    is_published: true,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "Concours d'Automne Arantino",
    discipline: "CSO",
    event_date: new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10),
    location: "Avrainville (91)",
    level: "Amateur",
    description:
      "Belle journée de concours à domicile, podium 100% Écuries Arantino.",
    podium: [
      { rank: 1, rider: "Léa Martin", horse: "Uranus du Vent" },
      { rank: 2, rider: "Hugo Bernard", horse: "Vegas de la Plaine" },
      { rank: 3, rider: "Camille Petit", horse: "Quibelle d'Or" },
    ],
    image_url: null,
    is_featured: true,
    is_published: true,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
