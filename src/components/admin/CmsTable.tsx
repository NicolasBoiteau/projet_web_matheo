"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { CMS_META, type CmsType } from "@/lib/cms"

function renderCell(value: unknown) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">Oui</span>
    ) : (
      <span className="text-gray-300">—</span>
    )
  }
  if (value == null || value === "") return <span className="text-gray-300">—</span>
  return String(value)
}

export function CmsTable({
  type,
  items,
}: {
  type: CmsType
  items: Record<string, unknown>[]
}) {
  const router = useRouter()
  const meta = CMS_META[type]
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (item: Record<string, unknown>) => {
    if (!confirm(`Supprimer « ${item[meta.titleKey]} » ?`)) return
    setDeletingId(item.id as string)
    setError(null)
    try {
      const res = await fetch(`/api/cms/${type}/${item.id}`, { method: "DELETE" })
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

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-fir/20 p-12 text-center text-gray-500">
        Aucun élément.{" "}
        <Link href={`/admin/contenu/${type}/nouveau`} className="font-medium text-gold hover:underline">
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
              {meta.columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fir/5">
            {items.map((item) => (
              <tr key={item.id as string} className="hover:bg-fir/[0.02]">
                {meta.columns.map((c, idx) => (
                  <td key={c.key} className="px-4 py-3">
                    {idx === 0 ? (
                      <span className="font-medium text-fir">{renderCell(item[c.key])}</span>
                    ) : (
                      <span className="text-gray-500">{renderCell(item[c.key])}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/contenu/${type}/${item.id}`}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-fir/5 hover:text-fir"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    >
                      {deletingId === item.id ? (
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
