"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, CalendarDays, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/shared/EmptyState"
import { SLOT_TYPE_LABELS } from "@/lib/bookings"
import { formatDate, formatTime, formatPrice } from "@/lib/utils/formatters"
import type { SlotWithRemaining, SlotType } from "@/lib/supabase/types"

type Step = "type" | "slot" | "details" | "done"

export function BookingForm({ slots }: { slots: SlotWithRemaining[] }) {
  const [step, setStep] = useState<Step>("type")
  const [selectedType, setSelectedType] = useState<SlotType | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotWithRemaining | null>(null)
  const [participants, setParticipants] = useState(1)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needLogin, setNeedLogin] = useState(false)

  const bookable = useMemo(() => slots.filter((s) => s.remaining > 0), [slots])

  const typesAvailable = useMemo(() => {
    const set = new Set(bookable.map((s) => s.slot_type))
    return Array.from(set)
  }, [bookable])

  const slotsForType = useMemo(
    () => bookable.filter((s) => s.slot_type === selectedType),
    [bookable, selectedType]
  )

  const handleSubmit = async () => {
    if (!selectedSlot) return
    setSubmitting(true)
    setError(null)
    setNeedLogin(false)
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: selectedSlot.id,
          participants,
          notes,
        }),
      })
      if (res.status === 401) {
        setNeedLogin(true)
        setSubmitting(false)
        return
      }
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Une erreur est survenue")
      setStep("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setSubmitting(false)
    }
  }

  if (bookable.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="h-12 w-12" />}
        title="Aucun créneau disponible"
        description="De nouveaux créneaux seront publiés prochainement. N'hésitez pas à nous contacter."
        action={
          <Link href="/contact">
            <Button variant="primary">Nous contacter</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-fir/5">
        <CardContent className="p-6">
          {step === "type" && (
            <>
              <h2 className="mb-6 font-display text-xl font-bold text-fir">Choisissez un service</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {typesAvailable.map((type) => {
                  const count = bookable.filter((s) => s.slot_type === type).length
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type)
                        setStep("slot")
                      }}
                      className="rounded-2xl border-2 border-fir/10 p-5 text-left transition-all hover:border-gold/50"
                    >
                      <h3 className="font-semibold text-fir">{SLOT_TYPE_LABELS[type]}</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {count} créneau{count > 1 ? "x" : ""} disponible{count > 1 ? "s" : ""}
                      </p>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {step === "slot" && (
            <>
              <h2 className="mb-6 font-display text-xl font-bold text-fir">
                Créneaux — {selectedType && SLOT_TYPE_LABELS[selectedType]}
              </h2>
              <div className="space-y-3">
                {slotsForType.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => {
                      setSelectedSlot(slot)
                      setParticipants(1)
                      setStep("details")
                    }}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-fir/10 p-4 text-left transition-all hover:border-gold/50"
                  >
                    <div>
                      <p className="font-medium text-fir">{slot.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(slot.start_time)} · {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gold">{formatPrice(slot.price_cents)}</p>
                      <p className="text-xs text-gray-400">{slot.remaining} place(s)</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("type")}
                className="mt-6 text-sm text-gray-500 hover:text-gold"
              >
                ← Changer de service
              </button>
            </>
          )}

          {step === "details" && selectedSlot && (
            <>
              <h2 className="mb-6 font-display text-xl font-bold text-fir">Détails de la réservation</h2>

              {needLogin && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Vous devez être connecté pour réserver.{" "}
                  <Link href="/login" className="font-medium underline">
                    Se connecter
                  </Link>
                </div>
              )}
              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="rounded-xl bg-gold/5 p-4">
                <p className="font-medium text-fir">{selectedSlot.title}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {formatDate(selectedSlot.start_time)} · {formatTime(selectedSlot.start_time)} – {formatTime(selectedSlot.end_time)}
                </p>
                <p className="mt-1 text-sm font-semibold text-gold">
                  {formatPrice(selectedSlot.price_cents)} / participant
                </p>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-fir">
                  <Users className="mr-1 inline h-4 w-4" /> Participants
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedSlot.remaining}
                  value={participants}
                  onChange={(e) =>
                    setParticipants(
                      Math.min(selectedSlot.remaining, Math.max(1, Number(e.target.value) || 1))
                    )
                  }
                  className="w-32 rounded-xl border border-fir/10 bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <span className="ml-2 text-xs text-gray-400">{selectedSlot.remaining} max</span>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-fir">Notes (optionnel)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-y rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Niveau, cheval, objectifs..."
                />
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Aucun paiement en ligne : le règlement s'effectue sur place. Votre demande sera confirmée par le centre.
              </p>

              <div className="mt-6 flex gap-3">
                <Button onClick={handleSubmit} variant="primary" loading={submitting}>
                  Confirmer la réservation
                </Button>
                <Button variant="outline" onClick={() => setStep("slot")}>
                  Retour
                </Button>
              </div>
            </>
          )}

          {step === "done" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-fir">Demande envoyée !</h3>
              <p className="mt-2 max-w-sm text-sm text-gray-600">
                Votre réservation est enregistrée (en attente de confirmation par le centre). Le
                règlement s'effectue sur place.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/membre/planning">
                  <Button variant="primary">Voir mon planning</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedType(null)
                    setSelectedSlot(null)
                    setNotes("")
                    setStep("type")
                  }}
                >
                  Nouvelle réservation
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
