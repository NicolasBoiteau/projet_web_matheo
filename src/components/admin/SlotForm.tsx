"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { SLOT_TYPE_LABELS } from "@/lib/bookings"
import type { BookingSlot, SlotType } from "@/lib/supabase/types"

/** ISO (UTC) → valeur d'un <input type="datetime-local"> (heure locale). */
function isoToLocalInput(iso: string): string {
  const d = new Date(iso)
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

export function SlotForm({
  initialData,
  basePath = "/admin/creneaux",
}: {
  initialData?: BookingSlot
  basePath?: string
}) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const [slotType, setSlotType] = useState<SlotType>(initialData?.slot_type ?? "lesson")
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [startTime, setStartTime] = useState(
    initialData ? isoToLocalInput(initialData.start_time) : ""
  )
  const [endTime, setEndTime] = useState(
    initialData ? isoToLocalInput(initialData.end_time) : ""
  )
  const [maxParticipants, setMaxParticipants] = useState(
    initialData?.max_participants?.toString() ?? "1"
  )
  const [priceEuros, setPriceEuros] = useState(
    initialData != null ? (initialData.price_cents / 100).toString() : ""
  )
  const [isAvailable, setIsAvailable] = useState(initialData?.is_available ?? true)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputClass =
    "w-full rounded-xl border border-fir/10 bg-white px-4 py-2.5 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (new Date(endTime) <= new Date(startTime)) {
      setError("L'heure de fin doit être après l'heure de début.")
      return
    }

    setSubmitting(true)
    const body = {
      slot_type: slotType,
      title,
      description: description || null,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      max_participants: Number(maxParticipants) || 1,
      price_cents: priceEuros ? Math.round(Number(priceEuros) * 100) : 0,
      is_available: isAvailable,
    }

    try {
      const res = await fetch(
        isEdit ? `/api/slots/${initialData!.id}` : "/api/slots",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Une erreur est survenue")
      router.push(basePath)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Type *</label>
          <select value={slotType} onChange={(e) => setSlotType(e.target.value as SlotType)} className={inputClass}>
            {Object.entries(SLOT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Titre *</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Cours CSO débutants" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Début *</label>
          <input required type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Fin *</label>
          <input required type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Places</label>
          <input type="number" min={1} value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Prix (€)</label>
          <input type="number" min={0} step="0.01" value={priceEuros} onChange={(e) => setPriceEuros(e.target.value)} className={inputClass} placeholder="50" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fir">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-fir">
        <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold" />
        Disponible à la réservation
      </label>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={submitting}>
          {isEdit ? "Enregistrer" : "Créer le créneau"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(basePath)}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
