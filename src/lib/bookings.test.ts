import { describe, it, expect } from "vitest"
import {
  computeRemaining,
  reservationsToEvents,
  STATUS_LABELS,
  ACTIVE_RESERVATION_STATUSES,
} from "@/lib/bookings"
import type { ReservationWithSlot } from "@/lib/supabase/types"

describe("computeRemaining", () => {
  it("retourne la capacité complète sans réservation", () => {
    expect(computeRemaining(8, [])).toBe(8)
  })

  it("soustrait les participants des réservations actives", () => {
    const resv = [
      { participants: 2, status: "pending" },
      { participants: 1, status: "confirmed" },
    ]
    expect(computeRemaining(8, resv)).toBe(5)
  })

  it("ignore les réservations annulées / terminées / absentes", () => {
    const resv = [
      { participants: 3, status: "cancelled" },
      { participants: 2, status: "completed" },
      { participants: 1, status: "no_show" },
      { participants: 2, status: "confirmed" },
    ]
    expect(computeRemaining(8, resv)).toBe(6)
  })

  it("compte 1 place par défaut quand participants est absent ou null", () => {
    expect(computeRemaining(5, [{ status: "pending" }, { participants: null, status: "confirmed" }])).toBe(3)
  })

  it("ne descend jamais sous zéro (surbooking borné)", () => {
    expect(computeRemaining(2, [{ participants: 5, status: "confirmed" }])).toBe(0)
  })

  it("traite une réservation sans statut comme active", () => {
    expect(computeRemaining(4, [{ participants: 1 }])).toBe(3)
  })

  it("expose pending et confirmed comme seuls statuts actifs", () => {
    expect(ACTIVE_RESERVATION_STATUSES).toEqual(["pending", "confirmed"])
  })
})

describe("reservationsToEvents", () => {
  const slot = {
    title: "Cours collectif",
    start_time: "2026-06-10T14:00:00.000Z",
    end_time: "2026-06-10T15:00:00.000Z",
  }

  it("exclut les réservations annulées et celles sans créneau", () => {
    const reservations = [
      { status: "confirmed", booking_slots: slot },
      { status: "cancelled", booking_slots: slot },
      { status: "pending", booking_slots: null },
    ] as unknown as ReservationWithSlot[]

    const events = reservationsToEvents(reservations)
    expect(events).toHaveLength(1)
    expect(events[0].title).toContain("Cours collectif")
    expect(events[0].title).toContain(STATUS_LABELS.confirmed)
    expect(events[0].start).toBe(slot.start_time)
    expect(events[0].end).toBe(slot.end_time)
  })
})
