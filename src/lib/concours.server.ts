import "server-only"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/horses"
import { FALLBACK_CONCOURS } from "@/lib/concours"
import type { Concours } from "@/lib/supabase/types"

/** Concours publiés (page publique), triés du plus récent au plus ancien. */
export async function getPublishedConcours(): Promise<Concours[]> {
  if (!isSupabaseConfigured()) return FALLBACK_CONCOURS
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("concours")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: false })
    if (error || !data) return FALLBACK_CONCOURS
    return data as Concours[]
  } catch {
    return FALLBACK_CONCOURS
  }
}

/** Tous les concours (back-office équipe), publiés ou non. */
export async function getAllConcours(): Promise<Concours[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("concours")
      .select("*")
      .order("event_date", { ascending: false })
    return (data as Concours[]) ?? []
  } catch {
    return []
  }
}

/** Un concours par id (back-office). */
export async function getConcours(id: string): Promise<Concours | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("concours").select("*").eq("id", id).single()
    return (data as Concours) ?? null
  } catch {
    return null
  }
}
