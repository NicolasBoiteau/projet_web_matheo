"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Trophy, Medal, Award } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { rankLabel } from "@/lib/concours"
import type { Concours, PodiumEntry } from "@/lib/supabase/types"

const inputClass =
  "w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"

const RANK_ICON = [Trophy, Medal, Award]

type Props = {
  initial?: Concours | null
  onDone: () => void
}

export function ConcoursForm({ initial, onDone }: Props) {
  const router = useRouter()
  const [name, setName] = useState(initial?.name ?? "")
  const [discipline, setDiscipline] = useState(initial?.discipline ?? "")
  const [eventDate, setEventDate] = useState(initial?.event_date ?? "")
  const [location, setLocation] = useState(initial?.location ?? "")
  const [level, setLevel] = useState(initial?.level ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false)
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true)
  const [podium, setPodium] = useState<PodiumEntry[]>(
    initial?.podium?.length ? initial.podium : []
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addPodiumRow = () =>
    setPodium((p) => [...p, { rank: p.length + 1, rider: "", horse: "" }])

  const updateRow = (i: number, patch: Partial<PodiumEntry>) =>
    setPodium((p) => p.map((row, idx) => (idx === i ? { ...row, ...patch } : row)))

  const removeRow = (i: number) =>
    setPodium((p) => p.filter((_, idx) => idx !== i).map((row, idx) => ({ ...row, rank: idx + 1 })))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !eventDate) {
      setError("Le nom et la date du concours sont obligatoires.")
      return
    }
    setSaving(true)

    const payload = {
      name: name.trim(),
      discipline: discipline.trim(),
      event_date: eventDate,
      location: location.trim(),
      level: level.trim(),
      description: description.trim(),
      is_featured: isFeatured,
      is_published: isPublished,
      podium: podium.map((row, i) => ({
        rank: i + 1,
        rider: row.rider.trim(),
        horse: row.horse?.trim() || null,
      })),
    }

    try {
      const res = await fetch(
        initial ? `/api/concours/${initial.id}` : "/api/concours",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || "Échec de l'enregistrement")
      }
      router.refresh()
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-fir">Nom du concours *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Grand Prix de Printemps" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Date *</label>
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Discipline</label>
          <input value={discipline} onChange={(e) => setDiscipline(e.target.value)} className={inputClass} placeholder="CSO, Dressage, CCE…" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Lieu</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="Avrainville (91)" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Niveau</label>
          <input value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass} placeholder="Club 1, Amateur, Pro…" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-fir">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} placeholder="Quelques mots sur le concours…" />
        </div>
      </div>

      {/* Podium structuré */}
      <div className="rounded-2xl border border-fir/10 bg-cream/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-fir">Podium / résultats</p>
            <p className="text-xs text-gray-500">Laissez vide pour un concours à venir.</p>
          </div>
          <button
            type="button"
            onClick={addPodiumRow}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 px-3 py-1.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
          >
            <Plus className="h-4 w-4" /> Ajouter un rang
          </button>
        </div>

        {podium.length === 0 ? (
          <p className="py-2 text-center text-sm text-gray-400">Aucun résultat saisi.</p>
        ) : (
          <div className="space-y-2">
            {podium.map((row, i) => {
              const Icon = RANK_ICON[i] ?? Award
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex h-9 w-14 shrink-0 items-center justify-center gap-1 rounded-lg bg-white text-xs font-bold text-gold ring-1 ring-gold/20">
                    <Icon className="h-3.5 w-3.5" /> {rankLabel(i + 1)}
                  </span>
                  <input
                    value={row.rider}
                    onChange={(e) => updateRow(i, { rider: e.target.value })}
                    className={inputClass}
                    placeholder="Cavalier"
                  />
                  <input
                    value={row.horse ?? ""}
                    onChange={(e) => updateRow(i, { horse: e.target.value })}
                    className={inputClass}
                    placeholder="Cheval"
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Retirer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-fir">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold" />
          Mettre en avant
        </label>
        <label className="flex items-center gap-2 text-sm text-fir">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold" />
          Publié (visible sur le site)
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={saving}>
          {initial ? "Enregistrer" : "Créer le concours"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone} disabled={saving}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
