"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ImageUpload, uploadHorseImage } from "@/components/admin/ImageUpload"
import type { Horse } from "@/lib/supabase/types"

const DISCIPLINES = [
  "CSO",
  "Concours complet",
  "Dressage",
  "Cross",
  "Attelage",
  "Endurance",
  "TREC",
]

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

type HorseFormProps = {
  initialData?: Horse
}

export function HorseForm({ initialData }: HorseFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const [name, setName] = useState(initialData?.name ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [slugEdited, setSlugEdited] = useState(isEdit)
  const [breed, setBreed] = useState(initialData?.breed ?? "")
  const [gender, setGender] = useState<string>(initialData?.gender ?? "")
  const [birthYear, setBirthYear] = useState(initialData?.birth_year?.toString() ?? "")
  const [heightCm, setHeightCm] = useState(initialData?.height_cm?.toString() ?? "")
  const [color, setColor] = useState(initialData?.color ?? "")
  const [disciplines, setDisciplines] = useState<string[]>(initialData?.disciplines ?? [])
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [mainImage, setMainImage] = useState<string | null>(initialData?.main_image_url ?? null)
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery_urls ?? [])
  const [pedigree, setPedigree] = useState(initialData?.pedigree ?? "")
  const [competitionLevel, setCompetitionLevel] = useState(initialData?.competition_level ?? "")
  const [isForSale, setIsForSale] = useState(initialData?.is_for_sale ?? false)
  const [salePriceEuros, setSalePriceEuros] = useState(
    initialData?.sale_price_cents != null ? (initialData.sale_price_cents / 100).toString() : ""
  )
  const [featured, setFeatured] = useState(initialData?.featured ?? false)
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? true)

  const [submitting, setSubmitting] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugEdited) setSlug(slugify(value))
  }

  const toggleDiscipline = (d: string) => {
    setDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    )
  }

  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setGalleryUploading(true)
    setError(null)
    try {
      const urls = await Promise.all(files.map((f) => uploadHorseImage(f)))
      setGallery((prev) => [...prev, ...urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload de la galerie")
    } finally {
      setGalleryUploading(false)
      if (galleryInputRef.current) galleryInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const body = {
      name,
      slug: slug || slugify(name),
      breed: breed || null,
      gender: gender || null,
      birth_year: birthYear ? Number(birthYear) : null,
      height_cm: heightCm ? Number(heightCm) : null,
      color: color || null,
      disciplines,
      description: description || null,
      main_image_url: mainImage,
      gallery_urls: gallery,
      pedigree: pedigree || null,
      competition_level: competitionLevel || null,
      is_for_sale: isForSale,
      sale_price_cents: isForSale && salePriceEuros ? Math.round(Number(salePriceEuros) * 100) : null,
      featured,
      is_published: isPublished,
    }

    try {
      const res = await fetch(
        isEdit ? `/api/horses/${initialData!.id}` : "/api/horses",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Une erreur est survenue")
      }
      router.push("/admin/chevaux")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setSubmitting(false)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-fir/10 bg-white px-4 py-2.5 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Identité */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Nom *</label>
          <input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="Uranus des Prés"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Slug *</label>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugEdited(true)
            }}
            className={inputClass}
            placeholder="uranus-des-pres"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Race</label>
          <input value={breed} onChange={(e) => setBreed(e.target.value)} className={inputClass} placeholder="Selle Français" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Sexe</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
            <option value="">—</option>
            <option value="male">Mâle</option>
            <option value="female">Femelle</option>
            <option value="gelding">Hongre</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Année de naissance</label>
          <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className={inputClass} placeholder="2016" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Taille (cm)</label>
          <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={inputClass} placeholder="170" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Robe</label>
          <input value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} placeholder="Bai" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fir">Niveau de compétition</label>
          <input value={competitionLevel} onChange={(e) => setCompetitionLevel(e.target.value)} className={inputClass} placeholder="Club 1 Elite" />
        </div>
      </div>

      {/* Disciplines */}
      <div>
        <label className="mb-2 block text-sm font-medium text-fir">Disciplines</label>
        <div className="flex flex-wrap gap-2">
          {DISCIPLINES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDiscipline(d)}
              className={
                disciplines.includes(d)
                  ? "rounded-full border border-gold bg-gold/10 px-4 py-1.5 text-sm text-gold"
                  : "rounded-full border border-fir/15 px-4 py-1.5 text-sm text-gray-500 hover:border-gold/50"
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Description / pedigree */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-fir">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-fir">Pedigree</label>
        <textarea value={pedigree} onChange={(e) => setPedigree(e.target.value)} rows={2} className={inputClass} />
      </div>

      {/* Image principale */}
      <ImageUpload value={mainImage ?? undefined} onChange={setMainImage} label="Image principale" />

      {/* Galerie */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-fir">Galerie</label>
        <div className="flex flex-wrap gap-3">
          {gallery.map((url) => (
            <div key={url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-28 w-28 rounded-xl border border-fir/10 object-cover" />
              <button
                type="button"
                onClick={() => setGallery((prev) => prev.filter((u) => u !== url))}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={galleryUploading}
            className="flex h-28 w-28 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-fir/20 text-gray-400 transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
          >
            {galleryUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span className="text-[11px]">Ajouter</span>
          </button>
        </div>
        <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryFiles} className="hidden" />
      </div>

      {/* Options */}
      <div className="space-y-3 rounded-xl border border-fir/10 bg-white p-4">
        <label className="flex items-center gap-2.5 text-sm text-fir">
          <input type="checkbox" checked={isForSale} onChange={(e) => setIsForSale(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold" />
          À vendre
        </label>
        {isForSale && (
          <div className="pl-6">
            <label className="mb-1.5 block text-sm font-medium text-fir">Prix de vente (€)</label>
            <input type="number" value={salePriceEuros} onChange={(e) => setSalePriceEuros(e.target.value)} className={inputClass + " max-w-xs"} placeholder="35000" />
          </div>
        )}
        <label className="flex items-center gap-2.5 text-sm text-fir">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold" />
          Mis en avant
        </label>
        <label className="flex items-center gap-2.5 text-sm text-fir">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold" />
          Publié (visible sur le site)
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={submitting}>
          {isEdit ? "Enregistrer" : "Créer le cheval"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/chevaux")}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
