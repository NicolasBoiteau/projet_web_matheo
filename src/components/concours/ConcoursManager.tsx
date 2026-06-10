"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Loader2, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { formatDate } from "@/lib/utils/formatters"
import { ConcoursForm } from "@/components/concours/ConcoursForm"
import type { Concours } from "@/lib/supabase/types"

export function ConcoursManager({ concours }: { concours: Concours[] }) {
  const router = useRouter()
  // null = pas de formulaire ; "new" = création ; Concours = édition.
  const [editing, setEditing] = useState<Concours | "new" | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (c: Concours) => {
    if (!confirm(`Supprimer le concours « ${c.name} » ?`)) return
    setDeletingId(c.id)
    setError(null)
    try {
      const res = await fetch(`/api/concours/${c.id}`, { method: "DELETE" })
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

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-fir sm:text-3xl">Concours</h1>
        {!editing && (
          <button
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
          >
            <Plus className="h-4 w-4" />
            Ajouter un concours
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {editing && (
        <Card className="mb-8 border-gold/30">
          <CardContent className="p-6">
            <h2 className="mb-5 font-display text-lg font-bold text-fir">
              {editing === "new" ? "Nouveau concours" : `Modifier « ${editing.name} »`}
            </h2>
            <ConcoursForm
              initial={editing === "new" ? null : editing}
              onDone={() => setEditing(null)}
            />
          </CardContent>
        </Card>
      )}

      {concours.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-fir/20 p-12 text-center text-gray-500">
          <Trophy className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          Aucun concours pour le moment.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-fir/10 bg-white">
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="border-b border-fir/10 bg-fir/5 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Concours</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Podium</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fir/5">
              {concours.map((c) => {
                const isPast = c.event_date < today
                return (
                  <tr key={c.id} className="hover:bg-fir/[0.02]">
                    <td className="px-4 py-3">
                      <span className="font-medium text-fir">{c.name}</span>
                      {c.discipline && (
                        <span className="ml-2 text-xs text-gray-400">{c.discipline}</span>
                      )}
                      {!c.is_published && (
                        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          Brouillon
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(c.event_date, { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          isPast
                            ? "rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                            : "rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold"
                        }
                      >
                        {isPast ? "Passé" : "À venir"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {c.podium?.length ? `${c.podium.length} place(s)` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing(c)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-fir/5 hover:text-fir"
                          aria-label="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          disabled={deletingId === c.id}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                          aria-label="Supprimer"
                        >
                          {deletingId === c.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
