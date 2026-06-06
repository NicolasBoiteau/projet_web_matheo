import type { ReservationStatus, ReservationWithSlot } from "@/lib/supabase/types"

/** Helpers PURS (client + serveur). Fetchers Supabase dans `bookings.server.ts`. */

export const SLOT_TYPE_LABELS: Record<string, string> = {
  lesson: "Cours",
  clinic: "Stage",
  arena_rental: "Location carrière",
}

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé",
  no_show: "Absent",
}

/** Classes Tailwind pour le badge d'un statut. */
export const STATUS_BADGE: Record<ReservationStatus, string> = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  completed: "bg-fir/10 text-fir",
  no_show: "bg-red-50 text-red-600",
}

const EVENT_COLORS: Record<ReservationStatus, string> = {
  pending: "#B58A3A",
  confirmed: "#C5A55A",
  cancelled: "#9CA3AF",
  completed: "#1B3A2D",
  no_show: "#DC2626",
}

/** Convertit des réservations (jointes au créneau) en évènements FullCalendar. */
export function reservationsToEvents(reservations: ReservationWithSlot[]) {
  return reservations
    .filter((r) => r.booking_slots && r.status !== "cancelled")
    .map((r) => ({
      title: `${r.booking_slots!.title} (${STATUS_LABELS[r.status]})`,
      start: r.booking_slots!.start_time,
      end: r.booking_slots!.end_time,
      backgroundColor: EVENT_COLORS[r.status],
      borderColor: EVENT_COLORS[r.status],
    }))
}
