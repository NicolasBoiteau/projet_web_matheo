"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { CMS_META, type CmsType, type CmsField } from "@/lib/cms"

const inputClass =
  "w-full rounded-xl border border-fir/10 bg-white px-4 py-2.5 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"

function initialValue(field: CmsField, data?: Record<string, unknown>) {
  const raw = data?.[field.name]
  switch (field.type) {
    case "price":
      return raw != null ? String(Number(raw) / 100) : ""
    case "tags":
      return Array.isArray(raw) ? (raw as string[]).join("\n") : ""
    case "boolean":
      if (typeof raw === "boolean") return raw
      return field.name === "is_published" || field.name === "is_available"
    case "number":
      return raw != null ? String(raw) : ""
    case "select":
      return (raw as string) ?? field.options?.[0]?.value ?? ""
    default:
      return (raw as string) ?? ""
  }
}

export function CmsForm({
  type,
  initialData,
}: {
  type: CmsType
  initialData?: Record<string, unknown>
}) {
  const router = useRouter()
  const meta = CMS_META[type]
  const isEdit = Boolean(initialData?.id)
  const listHref = `/admin/contenu/${type}`

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {}
    for (const f of meta.fields) init[f.name] = initialValue(f, initialData)
    return init
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const payload: Record<string, unknown> = {}
    for (const f of meta.fields) {
      const val = values[f.name]
      switch (f.type) {
        case "price":
          payload[f.name] = val ? Math.round(Number(val) * 100) : 0
          break
        case "number":
          payload[f.name] = val === "" || val == null ? null : Number(val)
          break
        case "boolean":
          payload[f.name] = Boolean(val)
          break
        case "tags":
          payload[f.name] = String(val || "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
          break
        default:
          payload[f.name] = val === "" ? null : val
      }
    }

    try {
      const res = await fetch(
        isEdit ? `/api/cms/${type}/${initialData!.id}` : `/api/cms/${type}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Une erreur est survenue")
      router.push(listHref)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {meta.fields.map((f) => (
        <div key={f.name}>
          {f.type !== "boolean" && (
            <label className="mb-1.5 block text-sm font-medium text-fir">{f.label}</label>
          )}

          {f.type === "textarea" && (
            <textarea
              rows={4}
              value={values[f.name] as string}
              onChange={(e) => set(f.name, e.target.value)}
              className={inputClass}
            />
          )}

          {f.type === "tags" && (
            <textarea
              rows={4}
              value={values[f.name] as string}
              onChange={(e) => set(f.name, e.target.value)}
              className={inputClass}
              placeholder="Un élément par ligne"
            />
          )}

          {f.type === "select" && (
            <select
              value={values[f.name] as string}
              onChange={(e) => set(f.name, e.target.value)}
              className={inputClass}
            >
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}

          {f.type === "boolean" && (
            <label className="flex items-center gap-2.5 text-sm text-fir">
              <input
                type="checkbox"
                checked={Boolean(values[f.name])}
                onChange={(e) => set(f.name, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
              />
              {f.label}
            </label>
          )}

          {(f.type === "text" || f.type === "number" || f.type === "price") && (
            <input
              type={f.type === "text" ? "text" : "number"}
              step={f.type === "price" ? "0.01" : undefined}
              value={values[f.name] as string}
              onChange={(e) => set(f.name, e.target.value)}
              className={inputClass}
            />
          )}

          {f.help && <p className="mt-1 text-xs text-gray-400">{f.help}</p>}
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" loading={submitting}>
          {isEdit ? "Enregistrer" : `Créer`}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(listHref)}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
