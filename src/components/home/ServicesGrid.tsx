"use client"

import { motion } from "framer-motion"
import {
  Award, GraduationCap, Building2, ClipboardCheck, Truck, Rabbit,
  Star, Heart, Shield, Home, Trophy, Users, Sparkles, Medal,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import type { HomeService } from "@/lib/supabase/types"

const ICON_MAP: Record<string, LucideIcon> = {
  Award, GraduationCap, Building2, ClipboardCheck, Truck, Rabbit,
  Star, Heart, Shield, Home, Trophy, Users, Sparkles, Medal,
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export function ServicesGrid({ services }: { services: HomeService[] }) {
  return (
    <section className="relative bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-fir md:text-4xl lg:text-5xl">
            Nos Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Tout ce qu&apos;il faut pour le bien-être de votre cheval et votre progression.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-gold to-copper" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon ?? ""] ?? Building2
            return (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className="group h-full border-fir/5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 text-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-fir">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}