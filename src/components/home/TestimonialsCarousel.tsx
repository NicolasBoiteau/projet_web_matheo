"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import type { Testimonial } from "@/lib/supabase/types"

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (testimonials.length === 0) return
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  if (testimonials.length === 0) return null

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length)
  const next = () => goTo((current + 1) % testimonials.length)

  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-fir md:text-4xl">
            Ce qu&apos;ils disent
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-gold to-copper" />
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-fir/5">
                <CardContent className="p-10">
                  <div className="mb-4 flex justify-center gap-1">
                    {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="text-lg leading-relaxed text-gray-700 italic">
                    &ldquo;{testimonials[current].content}&rdquo;
                  </blockquote>
                  <div className="mt-6">
                    <p className="font-semibold text-fir">{testimonials[current].author}</p>
                    {testimonials[current].context && (
                      <p className="text-sm text-gray-500">{testimonials[current].context}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="rounded-full border border-gold/30 p-2 text-gold transition-colors hover:bg-gold hover:text-black"
              aria-label="Précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === current ? "w-6 bg-gold" : "bg-gold/30"
                  }`}
                  aria-label={`Avis ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="rounded-full border border-gold/30 p-2 text-gold transition-colors hover:bg-gold hover:text-black"
              aria-label="Suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}