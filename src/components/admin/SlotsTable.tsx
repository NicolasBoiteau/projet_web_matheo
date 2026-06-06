"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { SLOT_TYPE_LABELS } from "@/lib/bookings"
import { formatDate, formatTime, formatPrice } from "@/lib/utils/formatters"
import type { BookingSlot } from "@/lib/supabase/types"

export function SlotsTable({ slots }: { slots: BookingSlot[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (slot: BookingSlot) => {
    if (!confirm(`Supprimer le créneau « ${slot.title} » ?`)) return
    setDeletingId(slot.id)
    setError(null)
    try {
      const res = await fetch(`/api/slots/${slot.id}`, { method: "DELETE" })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || "Échec de la suppression")
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la suppression")
    } finally {
      setDeletingId(null)
    }
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-fir/20 p-12 text-center text-gray-500">
        Aucun créneau.{" "}
        <Link href="/admin/creneaux/nouveau" className="font-medium text-gold hover:underline">
          Créer le premier
        </Link>
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
              <th className="px-4 py-3 font-medium">Créneau</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Places</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fir/5">
            {slots.map((slot) => (
              <tr key={slot.id} className="hover:bg-fir/[0.02]">
                <td className="px-4 py-3">
                  <span className="font-medium text-fir">{slot.title}</span>
                  {!slot.is_available && (
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Masqué</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{SLOT_TYPE_LABELS[slot.slot_type]}</td>
                <td className="px-4 py-3 text-gray-500">
                  {formatDate(slot.start_time, { day: "numeric", month: "short" })} · {formatTime(slot.start_time)}
                </td>
                <td className="px-4 py-3 text-gray-500">{slot.max_participants}</td>
                <td className="px-4 py-3 text-gray-500">{formatPrice(slot.price_cents)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/creneaux/${slot.id}`}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-fir/5 hover:text-fir"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(slot)}
                      disabled={deletingId === slot.id}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    >
                      {deletingId === slot.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
