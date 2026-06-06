"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { Ruler, Calendar } from "lucide-react"

type HorseCardProps = {
  horse: {
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
  index?: number
}

export function HorseCard({ horse, index = 0 }: HorseCardProps) {
  const initials = horse.name.split(" ").map((n) => n[0]).join("").slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/cavalerie/${horse.slug.current}`} className="group block">
        <div className="relative mb-3 overflow-hidden rounded-2xl bg-fir/5">
          <div className="aspect-[4/3]">
            {horse.mainImage ? (
              <img
                src={horse.mainImage}
                alt={horse.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-4xl font-bold text-fir/20">{initials}</span>
              </div>
            )}
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Sale badge */}
          {horse.isForSale && (
            <div className="absolute top-3 left-3">
              <Badge variant="sale" className="bg-red-500 text-white">
                À vendre
              </Badge>
            </div>
          )}
        </div>

        <h3 className="font-display text-lg font-bold text-fir transition-colors group-hover:text-gold">
          {horse.name}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          {horse.breed && <span>{horse.breed}</span>}
          {horse.birthYear && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {horse.birthYear}
            </span>
          )}
          {horse.heightCm && (
            <span className="flex items-center gap-1">
              <Ruler className="h-3 w-3" />
              {horse.heightCm} cm
            </span>
          )}
        </div>

        {horse.disciplines && horse.disciplines.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {horse.disciplines.slice(0, 2).map((d) => (
              <Badge key={d} variant="default" className="text-[10px]">
                {d}
              </Badge>
            ))}
            {horse.disciplines.length > 2 && (
              <Badge variant="default" className="text-[10px]">
                +{horse.disciplines.length - 2}
              </Badge>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  )
}