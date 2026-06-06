"use client"

import { useState, useMemo, useCallback } from "react"
import { HorseCard } from "./HorseCard"
import { HorseFilters } from "./HorseFilters"
import { EmptyState } from "@/components/shared/EmptyState"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { SearchX } from "lucide-react"

type Horse = {
  _id: string
  name: string
  slug: { current: string }
  breed?: string
  birthYear?: number
  heightCm?: number
  color?: string
  disciplines?: string[]
  mainImage?: string
  isForSale?: boolean
  salePrice?: number
}

type HorseGridProps = {
  horses: Horse[]
  isLoading?: boolean
  forSale?: boolean
  preview?: number
}

export function HorseGrid({ horses, isLoading, forSale = false, preview }: HorseGridProps) {
  const [filters, setFilters] = useState<{
    disciplines: string[]
    breeds: string[]
    ageRange: { min: number; max: number } | null
  }>({ disciplines: [], breeds: [], ageRange: null })

  const filteredHorses = useMemo(() => {
    let result = forSale ? horses.filter((h) => h.isForSale) : horses

    if (filters.disciplines.length > 0) {
      result = result.filter(
        (h) =>
          h.disciplines &&
          h.disciplines.some((d) => filters.disciplines.includes(d))
      )
    }
    if (filters.breeds.length > 0) {
      result = result.filter(
        (h) => h.breed && filters.breeds.includes(h.breed)
      )
    }
    if (filters.ageRange) {
      result = result.filter(
        (h) =>
          h.birthYear &&
          new Date().getFullYear() - h.birthYear >= filters.ageRange!.min &&
          new Date().getFullYear() - h.birthYear <= filters.ageRange!.max
      )
    }

    if (preview) result = result.slice(0, preview)
    return result
  }, [horses, filters, forSale, preview])

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, [])

  if (isLoading) return <LoadingSpinner size="lg" />

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Filters sidebar */}
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-28 rounded-2xl border border-fir/5 bg-white p-6">
          <HorseFilters onChange={handleFilterChange} />
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        {filteredHorses.length === 0 ? (
          <EmptyState
            icon={<SearchX className="h-12 w-12" />}
            title="Aucun cheval trouvé"
            description="Essayez de modifier vos filtres pour voir plus de résultats."
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-500">
              {filteredHorses.length} cheval{filteredHorses.length > 1 ? "x" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredHorses.map((horse, i) => (
                <HorseCard key={horse._id} horse={horse} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}