"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/shared/EmptyState"
import { STATUS_LABELS, STATUS_BADGE, SLOT_TYPE_LABELS } from "@/lib/bookings"
import { formatDate, formatTime } from "@/lib/utils/formatters"
import type { ReservationWithSlot } from "@/lib/supabase/types"

export function MyReservations({ reservations }: { reservations: ReservationWithSlot[] }) {
  const router = useRouter()
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const handleCancel = async (id: string) => {
    if (!confirm("Annuler cette réservation ?")) return
    setCancellingId(id)
    try {
      await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      })
      router.refresh()
    } finally {
      setCancellingId(null)
    }
  }

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="Aucune réservation"
        description="Vous n'avez pas encore réservé de créneau."
        action={
          <Link href="/reservation">
            <Button variant="primary">Réserver un créneau</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {reservations.map((r) => {
        const slot = r.booking_slots
        const isUpcoming = slot ? new Date(slot.start_time) >= new Date() : false
        const canCancel = isUpcoming && (r.status === "pending" || r.status === "confirmed")
        return (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-xl border border-fir/5 bg-white p-4"
          >
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  {slot ? formatDate(slot.start_time, { day: "numeric", month: "short" }) : "—"}
                </p>
                <p className="font-semibold text-fir">{slot ? formatTime(slot.start_time) : ""}</p>
              </div>
              <div>
                <p className="font-medium text-fir">{slot?.title ?? "Créneau supprimé"}</p>
                <div className="mt-1 flex items-center gap-2">
                  {slot && (
                    <span className="text-xs text-gray-400">{SLOT_TYPE_LABELS[slot.slot_type]}</span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_BADGE[r.status]}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>
              </div>
            </div>
            {canCancel && (
              <button
                onClick={() => handleCancel(r.id)}
                disabled={cancellingId === r.id}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              >
                {cancellingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Annuler"}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
