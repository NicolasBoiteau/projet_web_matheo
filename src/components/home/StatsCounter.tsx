"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import type { HomeStat } from "@/lib/supabase/types"

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}</span>
}

export function StatsCounter({ stats }: { stats: HomeStat[] }) {
  return (
    <section className="relative bg-gradient-to-r from-fir to-fir-dark py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center"
            >
              <div className="font-display text-4xl font-bold text-gold md:text-5xl">
                <Counter end={stat.value} />
                {stat.suffix}
              </div>
              <p className="mt-2 text-sm text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}