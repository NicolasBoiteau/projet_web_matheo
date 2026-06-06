"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SLOT_TYPE_LABELS, STATUS_LABELS } from "@/lib/bookings"
import { formatDate, formatTime, formatPrice } from "@/lib/utils/formatters"
import type { ReservationStatus, ReservationWithDetails } from "@/lib/supabase/types"

const STATUS_OPTIONS: ReservationStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "no_show",
  "cancelled",
]

export function ReservationsTable({ reservations }: { reservations: ReservationWithDetails[] }) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || "Échec de la mise à jour")
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la mise à jour")
    } finally {
      setUpdatingId(null)
    }
  }

  if (reservations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-fir/20 p-12 text-center text-gray-500">
        Aucune réservation pour le moment.
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-fir/10 bg-white">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="border-b border-fir/10 bg-fir/5 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Membre</th>
              <th className="px-4 py-3 font-medium">Créneau</th>
              <th className="px-4 py-3 font-medium">Part.</th>
              <th className="px-4 py-3 font-medium">Montant</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fir/5">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-fir/[0.02]">
                <td className="px-4 py-3">
                  {r.profiles ? (
                    <>
                      <p className="font-medium text-fir">
                        {r.profiles.first_name} {r.profiles.last_name}
                      </p>
                      <p className="text-xs text-gray-400">{r.profiles.email}</p>
                    </>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.booking_slots ? (
                    <>
                      <p className="font-medium text-fir">{r.booking_slots.title}</p>
                      <p className="text-xs text-gray-400">
                        {SLOT_TYPE_LABELS[r.booking_slots.slot_type]} ·{" "}
                        {formatDate(r.booking_slots.start_time, { day: "numeric", month: "short" })} ·{" "}
                        {formatTime(r.booking_slots.start_time)}
                      </p>
                    </>
                  ) : (
                    <span className="text-gray-400">Créneau supprimé</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{r.participants}</td>
                <td className="px-4 py-3 text-gray-500">{formatPrice(r.amount_cents)}</td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    disabled={updatingId === r.id}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className="rounded-lg border border-fir/10 bg-white px-2 py-1.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
