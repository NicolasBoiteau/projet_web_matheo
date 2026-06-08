import "server-only"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/horses"
import { ACTIVE_RESERVATION_STATUSES, computeRemaining } from "@/lib/bookings"
import type {
  BookingSlot,
  ReservationWithSlot,
  ReservationWithDetails,
  SlotWithRemaining,
} from "@/lib/supabase/types"

const ACTIVE_STATUSES = ACTIVE_RESERVATION_STATUSES

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

    const bySlot: Record<string, Array<{ participants?: number | null }>> = {}
    for (const r of resv ?? []) {
      ;(bySlot[r.slot_id] ??= []).push(r)
    }

    return (slots as BookingSlot[]).map((s) => ({
      ...s,
      remaining: computeRemaining(s.max_participants, bySlot[s.id] ?? []),
    }))
  } catch {
    return []
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

/** Créneaux créés par le moniteur connecté. */
export async function getMySlots(): Promise<BookingSlot[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
      .from("booking_slots")
      .select("*")
      .eq("instructor_id", user.id)
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

/**
 * Réservations portant sur les cours du moniteur connecté (jointes au créneau
 * et au profil membre). Client admin car un moniteur n'a pas le droit RLS de
 * lire les réservations / profils des membres des autres.
 */
export async function getInstructorReservations(): Promise<ReservationWithDetails[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const admin = createAdminClient()
    const { data: slots } = await admin
      .from("booking_slots")
      .select("id")
      .eq("instructor_id", user.id)

    const ids = (slots ?? []).map((s) => s.id)
    if (ids.length === 0) return []

    const { data } = await admin
      .from("reservations")
      .select("*, booking_slots(*), profiles(first_name, last_name, email)")
      .in("slot_id", ids)
      .order("created_at", { ascending: false })
    return (data as ReservationWithDetails[]) ?? []
  } catch {
    return []
  }
}

/**
 * Inscrits d'un créneau (réservations actives jointes au profil membre).
 * Client admin (service_role) car un moniteur n'a pas le droit RLS de lire les
 * profils des membres. L'appelant DOIT vérifier au préalable qu'il a le droit
 * de voir ce créneau (admin, ou moniteur propriétaire du créneau).
 */
export async function getSlotParticipants(
  slotId: string
): Promise<ReservationWithDetails[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from("reservations")
      .select("*, profiles(first_name, last_name, email)")
      .eq("slot_id", slotId)
      .in("status", ACTIVE_RESERVATION_STATUSES)
      .order("created_at", { ascending: true })
    return (data as ReservationWithDetails[]) ?? []
  } catch {
    return []
  }
}
