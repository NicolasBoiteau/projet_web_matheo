"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils/cn"

const DISCIPLINES = [
  "CSO",
  "Concours complet",
  "Dressage",
  "Cross",
  "Attelage",
  "Endurance",
  "TREC",
]

const BREEDS = [
  "Selle Français",
  "KWPN",
  "Oldenbourg",
  "SF",
  "Anglo-Arabe",
  "Poney",
  "Autre",
]

const AGE_RANGES = [
  { label: "4-7 ans", min: 4, max: 7 },
  { label: "8-12 ans", min: 8, max: 12 },
  { label: "13+ ans", min: 13, max: 99 },
]

type HorseFiltersProps = {
  onChange: (filters: {
    disciplines: string[]
    breeds: string[]
    ageRange: { min: number; max: number } | null
  }) => void
}

export function HorseFilters({ onChange }: HorseFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([])
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([])
  const [selectedAgeRange, setSelectedAgeRange] = useState<{ min: number; max: number } | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Sync filters to parent
  useEffect(() => {
    onChange({ disciplines: selectedDisciplines, breeds: selectedBreeds, ageRange: selectedAgeRange })
  }, [selectedDisciplines, selectedBreeds, selectedAgeRange, onChange])

  const toggleDiscipline = (d: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    )
  }

  const toggleBreed = (b: string) => {
    setSelectedBreeds((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    )
  }

  const resetFilters = () => {
    setSelectedDisciplines([])
    setSelectedBreeds([])
    setSelectedAgeRange(null)
  }

  const hasActiveFilters = selectedDisciplines.length > 0 || selectedBreeds.length > 0 || selectedAgeRange !== null

  return (
    <div>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-fir/10 bg-white px-4 py-3 lg:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-fir">
          <Filter className="h-4 w-4" />
          Filtres
          {hasActiveFilters && (
            <Badge variant="default" className="ml-1">
              {selectedDisciplines.length + selectedBreeds.length + (selectedAgeRange ? 1 : 0)}
            </Badge>
          )}
        </span>
        <span className="text-xs text-gray-500">{isOpen ? "Fermer" : "Ouvrir"}</span>
      </button>

      <div className={cn("space-y-6", isOpen ? "block" : "hidden lg:block")}>
        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-dark"
          >
            <RotateCcw className="h-3 w-3" />
            Réinitialiser les filtres
          </button>
        )}

        {/* Discipline */}
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fir">
            Discipline
          </h4>
          <div className="space-y-2">
            {DISCIPLINES.map((d) => (
              <label key={d} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={selectedDisciplines.includes(d)}
                  onChange={() => toggleDiscipline(d)}
                  className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                />
                {d}
              </label>
            ))}
          </div>
        </div>

        {/* Breed */}
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fir">
            Race
          </h4>
          <div className="space-y-2">
            {BREEDS.map((b) => (
              <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={selectedBreeds.includes(b)}
                  onChange={() => toggleBreed(b)}
                  className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                />
                {b}
              </label>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fir">
            Âge
          </h4>
          <div className="space-y-2">
            {AGE_RANGES.map((r) => (
              <label key={r.label} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="radio"
                  name="age"
                  checked={selectedAgeRange?.min === r.min}
                  onChange={() => setSelectedAgeRange(selectedAgeRange?.min === r.min ? null : r)}
                  className="h-4 w-4 border-gray-300 text-gold focus:ring-gold"
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}