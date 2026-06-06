import "server-only"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/horses"
import { CMS_TABLES, type CmsType } from "@/lib/cms"
import {
  FALLBACK_PENSIONS,
  FALLBACK_TEAM,
  FALLBACK_EVENTS,
  FALLBACK_SERVICES,
  FALLBACK_STATS,
  FALLBACK_TESTIMONIALS,
} from "@/lib/content"
import type {
  PensionPack,
  TeamMember,
  EventItem,
  HomeService,
  HomeStat,
  Testimonial,
} from "@/lib/supabase/types"

/**
 * Fetcher générique : renvoie le contenu de la table (publié) trié par
 * sort_order, ou les données de repli si Supabase n'est pas configuré.
 */
async function fetchOrFallback<T>(
  table: string,
  fallback: T[],
  publishedColumn?: string
): Promise<T[]> {
  if (!isSupabaseConfigured()) return fallback
  try {
    const supabase = await createClient()
    let query = supabase.from(table).select("*").order("sort_order", { ascending: true })
    if (publishedColumn) query = query.eq(publishedColumn, true)
    const { data, error } = await query
    if (error || !data) return fallback
    return data as T[]
  } catch {
    return fallback
  }
}

export const getPensionPacks = () =>
  fetchOrFallback<PensionPack>("pension_packs", FALLBACK_PENSIONS)

export const getTeamMembers = () =>
  fetchOrFallback<TeamMember>("team_members", FALLBACK_TEAM, "is_published")

export const getEvents = () =>
  fetchOrFallback<EventItem>("events", FALLBACK_EVENTS, "is_published")

export const getHomeServices = () =>
  fetchOrFallback<HomeService>("home_services", FALLBACK_SERVICES)

export const getHomeStats = () =>
  fetchOrFallback<HomeStat>("home_stats", FALLBACK_STATS)

export const getTestimonials = () =>
  fetchOrFallback<Testimonial>("testimonials", FALLBACK_TESTIMONIALS, "is_published")

/** Versions admin (incluent les éléments non publiés). */
async function fetchAll<T>(table: string): Promise<T[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase.from(table).select("*").order("sort_order", { ascending: true })
    return (data as T[]) ?? []
  } catch {
    return []
  }
}

export const getAllPensionPacks = () => fetchAll<PensionPack>("pension_packs")
export const getAllTeamMembers = () => fetchAll<TeamMember>("team_members")
export const getAllEvents = () => fetchAll<EventItem>("events")
export const getAllHomeServices = () => fetchAll<HomeService>("home_services")
export const getAllHomeStats = () => fetchAll<HomeStat>("home_stats")
export const getAllTestimonials = () => fetchAll<Testimonial>("testimonials")

// Map type CMS → fetcher admin, pour les pages dynamiques /admin/contenu/[type]
export const ADMIN_FETCHERS: Record<CmsType, () => Promise<Record<string, unknown>[]>> = {
  pensions: getAllPensionPacks,
  equipe: getAllTeamMembers,
  stages: getAllEvents,
  services: getAllHomeServices,
  stats: getAllHomeStats,
  temoignages: getAllTestimonials,
}

/** Un élément CMS par id (admin). */
export async function getCmsItem(
  type: CmsType,
  id: string
): Promise<Record<string, unknown> | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from(CMS_TABLES[type].table).select("*").eq("id", id).single()
    return (data as Record<string, unknown>) ?? null
  } catch {
    return null
  }
}
