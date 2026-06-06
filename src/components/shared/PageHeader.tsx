"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"

type PageHeaderProps = {
  title: string
  subtitle?: string
  /** Classes supplémentaires pour la section (ex. espacement custom). */
  className?: string
}

/**
 * Bandeau d'en-tête commun à toutes les pages (titre + sous-titre).
 * - fond dégradé sapin, texte blanc lisible (contraste correct)
 * - dégagement du navbar fixe géré ici (pt-28/sm:pt-32)
 * - tailles fluides pensées mobile-first
 */
export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-fir-dark to-fir",
        className
      )}
    >
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
              {subtitle}
            </p>
          )}
          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-gold to-copper" />
        </motion.div>
      </div>
    </section>
  )
}
