"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/Button"

// Photo de remplacement (Unsplash). Remplaçable par votre propre vidéo/photo :
// déposez le fichier dans /public et changez la source ci-dessous.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?auto=format&fit=crop&w=2400&q=80"

export function HeroSection() {
  return (
    <section className="relative flex h-screen min-h-[600px] items-center justify-center overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Cheval dans les Écuries Arantino"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay sobre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
            Centre équestre · Avrainville
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          Les Écuries
          <br />
          <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
            Arantino
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-white/80 md:text-lg"
        >
          Cours, compétitions et stages — dans le respect du bien-être de nos équidés avant tout.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link href="/reservation">
            <Button variant="primary" size="xl" className="group">
              Réserver un stage
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/cavalerie">
            <Button variant="outline" size="xl" className="border-white/40 text-white hover:bg-white hover:text-fir">
              Découvrir la cavalerie
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Indicateur de défilement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="h-7 w-7 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
