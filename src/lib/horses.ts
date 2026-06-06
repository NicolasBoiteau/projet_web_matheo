import type { Horse } from "@/lib/supabase/types"

/**
 * Helpers PURS (utilisables côté client comme serveur).
 * Les fonctions qui interrogent Supabase vivent dans `horses.server.ts`
 * pour ne pas embarquer `next/headers` dans les bundles client.
 */

/**
 * Vrai uniquement si Supabase est réellement configuré (et pas un placeholder).
 * Permet aux pages publiques de ne pas planter en dev sans backend.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return Boolean(url && url.startsWith("http"))
}

/** Format attendu par HorseCard / HorseGrid (hérité des schémas Sanity). */
export type HorseCardData = {
  _id: string
  name: string
  slug: { current: string }
  breed?: string
  birthYear?: number
  heightCm?: number
  color?: string
  disciplines?: string[]
  mainImage?: string
  isForSale?: boolean
  salePrice?: number // en euros
}

/** Convertit une ligne Supabase vers le format des composants d'affichage. */
export function toHorseCard(h: Horse): HorseCardData {
  return {
    _id: h.id,
    name: h.name,
    slug: { current: h.slug },
    breed: h.breed ?? undefined,
    birthYear: h.birth_year ?? undefined,
    heightCm: h.height_cm ?? undefined,
    color: h.color ?? undefined,
    disciplines: h.disciplines,
    mainImage: h.main_image_url ?? undefined,
    isForSale: h.is_for_sale,
    salePrice: h.sale_price_cents != null ? h.sale_price_cents / 100 : undefined,
  }
}

/** Libellé français du sexe. */
export function frenchGender(gender: Horse["gender"]): string {
  switch (gender) {
    case "male":
      return "Mâle"
    case "female":
      return "Femelle"
    case "gelding":
      return "Hongre"
    default:
      return "—"
  }
}
