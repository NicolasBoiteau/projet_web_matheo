import "server-only"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/horses"
import type {
  BookingSlot,
  ReservationWithSlot,
  ReservationWithDetails,
  SlotWithRemaining,
} from "@/lib/supabase/types"

const ACTIVE_STATUSES = ["pending", "confirmed"]

/**
 * Créneaux à venir et disponibles, avec le nombre de places restantes.
 * Utilise le client admin (service_role) car compter les réservations des
 * autres membres n'est pas permis par les RLS pour un membre/visiteur.
 */
export async function getAvailableSlots(): Promise<SlotWithRemaining[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const admin = createAdminClient()
    const nowIso = new Date().toISOString()

    const { data: slots } = await admin
      .from("booking_slots")
      .select("*")
      .eq("is_available", true)
      .gte("start_time", nowIso)
      .order("start_time", { ascending: true })

    if (!slots || slots.length === 0) return []

    const ids = slots.map((s) => s.id)
    const { data: resv } = await admin
      .from("reservations")
      .select("slot_id, participants, status")
      .in("slot_id", ids)
      .in("status", ACTIVE_STATUSES)

    const used: Record<string, number> = {}
    for (const r of resv ?? []) {
      used[r.slot_id] = (used[r.slot_id] ?? 0) + (r.participants ?? 1)
    }

    return (slots as BookingSlot[]).map((s) => ({
      ...s,
      remaining: Math.max(0, s.max_participants - (used[s.id] ?? 0)),
    }))
  } catch {
    return []
  }
}

/** Places restantes pour un créneau (utilisé à la création d'une réservation). */
export async function getSlotRemaining(
  slotId: string
): Promise<{ slot: BookingSlot; remaining: number } | null> {
  try {
    const admin = createAdminClient()
    const { data: slot } = await admin
      .from("booking_slots")
      .select("*")
      .eq("id", slotId)
      .single()
    if (!slot) return null

    const { data: resv } = await admin
      .from("reservations")
      .select("participants")
      .eq("slot_id", slotId)
      .in("status", ACTIVE_STATUSES)

    const used = (resv ?? []).reduce((sum, r) => sum + (r.participants ?? 1), 0)
    return { slot: slot as BookingSlot, remaining: Math.max(0, slot.max_participants - used) }
  } catch {
    return null
  }
}

/** Réservations du membre connecté (jointes au créneau). */
export async function getUserReservations(): Promise<ReservationWithSlot[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
      .from("reservations")
      .select("*, booking_slots(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return (data as ReservationWithSlot[]) ?? []
  } catch {
    return []
  }
}

/** Tous les créneaux (admin). */
export async function getAllSlots(): Promise<BookingSlot[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("booking_slots")
      .select("*")
      .order("start_time", { ascending: false })
    return (data as BookingSlot[]) ?? []
  } catch {
    return []
  }
}

/** Toutes les réservations avec créneau + membre (admin). */
export async function getAllReservations(): Promise<ReservationWithDetails[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("reservations")
      .select("*, booking_slots(*), profiles(first_name, last_name, email)")
      .order("created_at", { ascending: false })
    return (data as ReservationWithDetails[]) ?? []
  } catch {
    return []
  }
}
