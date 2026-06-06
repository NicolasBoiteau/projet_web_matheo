"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import type { Horse } from "@/lib/supabase/types"

export function HorsesTable({ horses }: { horses: Horse[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (horse: Horse) => {
    if (!confirm(`Supprimer définitivement « ${horse.name} » ?`)) return
    setDeletingId(horse.id)
    setError(null)
    try {
      const res = await fetch(`/api/horses/${horse.id}`, { method: "DELETE" })
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

  if (horses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-fir/20 p-12 text-center text-gray-500">
        Aucun cheval pour le moment.{" "}
        <Link href="/admin/chevaux/nouveau" className="font-medium text-gold hover:underline">
          Ajouter le premier
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
        <table className="w-full min-w-[32rem] text-sm">
          <thead className="border-b border-fir/10 bg-fir/5 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Cheval</th>
              <th className="px-4 py-3 font-medium">Race</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fir/5">
            {horses.map((horse) => (
              <tr key={horse.id} className="hover:bg-fir/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {horse.main_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={horse.main_image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fir/5 text-xs font-bold text-fir/40">
                        {horse.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-fir">{horse.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{horse.breed || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {horse.is_for_sale && (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">À vendre</span>
                    )}
                    {horse.is_published ? (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">Publié</span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Brouillon</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/chevaux/${horse.id}`}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-fir/5 hover:text-fir"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(horse)}
                      disabled={deletingId === horse.id}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    >
                      {deletingId === horse.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
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
