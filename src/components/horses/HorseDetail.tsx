"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Ruler, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils/formatters"
import { frenchGender } from "@/lib/horses"
import type { Horse } from "@/lib/supabase/types"

export function HorseDetail({ horse }: { horse: Horse }) {
  const images = [horse.main_image_url, ...horse.gallery_urls].filter(Boolean) as string[]
  const [activeImage, setActiveImage] = useState<string | null>(images[0] ?? null)

  const specs = [
    { icon: Calendar, label: "Né en", value: horse.birth_year },
    { icon: Ruler, label: "Taille", value: horse.height_cm ? `${horse.height_cm} cm` : null },
    { label: "Robe", value: horse.color },
    { label: "Sexe", value: horse.gender ? frenchGender(horse.gender) : null },
    { label: "Race", value: horse.breed },
    { label: "Niveau", value: horse.competition_level },
  ].filter((s) => s.value)

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Link
          href="/cavalerie"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la cavalerie
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Galerie */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="overflow-hidden rounded-2xl bg-fir/5">
              {activeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeImage} alt={horse.name} className="h-96 w-full object-cover" />
              ) : (
                <div className="flex h-96 items-center justify-center">
                  <span className="font-display text-6xl font-bold text-fir/10">
                    {horse.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((url) => (
                  <button
                    key={url}
                    onClick={() => setActiveImage(url)}
                    className={
                      activeImage === url
                        ? "overflow-hidden rounded-xl ring-2 ring-gold"
                        : "overflow-hidden rounded-xl ring-1 ring-fir/10"
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-20 w-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Détails */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="font-display text-4xl font-bold text-fir">{horse.name}</h1>

            {horse.is_for_sale && horse.sale_price_cents != null && (
              <p className="mt-2 text-2xl font-bold text-gold">
                {formatPrice(horse.sale_price_cents)}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4">
              {specs.map((spec) => (
                <div key={spec.label} className="rounded-xl border border-fir/5 bg-white p-4">
                  <p className="text-xs text-gray-500">{spec.label}</p>
                  <p className="mt-1 font-semibold text-fir">{spec.value}</p>
                </div>
              ))}
            </div>

            {horse.disciplines.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-fir">Disciplines</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {horse.disciplines.map((d) => (
                    <Badge key={d} variant="default">
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {horse.description && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-fir">Description</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{horse.description}</p>
              </div>
            )}

            {horse.pedigree && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-fir">Pedigree</h3>
                <p className="mt-2 text-sm text-gray-600">{horse.pedigree}</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Link href="/contact">
                <Button variant="primary">Demander des informations</Button>
              </Link>
              {horse.is_for_sale && (
                <Link href="/reservation">
                  <Button variant="outline">Réserver une visite</Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
