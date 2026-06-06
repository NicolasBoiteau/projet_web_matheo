import "server-only"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/horses"
import type { Horse } from "@/lib/supabase/types"

/** Tous les chevaux publiés (lecture publique via RLS). */
export async function getPublishedHorses(): Promise<Horse[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("horses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

/** Chevaux publiés et à vendre. */
export async function getHorsesForSale(): Promise<Horse[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("horses")
      .select("*")
      .eq("is_published", true)
      .eq("is_for_sale", true)
      .order("created_at", { ascending: false })
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

/** Un cheval publié par son slug. */
export async function getHorseBySlug(slug: string): Promise<Horse | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("horses")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()
    if (error) return null
    return data
  } catch {
    return null
  }
}
