"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-fir-dark to-fir py-24">
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
            Prêt à rejoindre
            <br />
            <span className="text-gold">Les Écuries Arantino ?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Réservez votre visite, inscrivez-vous à un stage ou venez découvrir nos installations.
            L&apos;excellence vous attend.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/reservation">
              <Button variant="primary" size="xl" className="group">
                Réserver maintenant
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="xl">
                Nous contacter
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
    </section>
  )
}