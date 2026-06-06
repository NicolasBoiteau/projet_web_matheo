"use client"

import { useState, useRef } from "react"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const BUCKET = "horse-images"

/** Upload un fichier vers le bucket et renvoie son URL publique. */
export async function uploadHorseImage(file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split(".").pop()
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

type ImageUploadProps = {
  value?: string
  onChange: (url: string | null) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadHorseImage(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-fir">{label}</label>

      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Aperçu"
            className="h-40 w-40 rounded-xl border border-fir/10 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-fir/20 text-gray-400 transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs">Choisir une image</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
