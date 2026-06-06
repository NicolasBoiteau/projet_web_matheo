"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/shared/PageHeader"
import { formatPrice } from "@/lib/utils/formatters"
import type { EventItem } from "@/lib/supabase/types"

export function StagesView({ events }: { events: EventItem[] }) {
  return (
    <div>
      <PageHeader
        title="Stages & Événements"
        subtitle="Des stages toute l'année encadrés par nos coachs et des intervenants professionnels."
      />

      <section className="relative -mt-8 pb-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid gap-6">
            {events.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card
                  className={`border-fir/5 transition-all duration-300 hover:shadow-lg ${
                    stage.is_featured ? "border-gold ring-1 ring-gold/30" : ""
                  }`}
                >
                  <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <h3 className="font-display text-xl font-bold text-fir">{stage.title}</h3>
                        {stage.is_featured && (
                          <Badge variant="default" className="mt-1 shrink-0">
                            Recommandé
                          </Badge>
                        )}
                      </div>
                      {stage.description && <p className="mt-2 text-sm text-gray-600">{stage.description}</p>}
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                        {stage.date_label && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-gold" /> {stage.date_label}
                          </span>
                        )}
                        {stage.time_label && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-gold" /> {stage.time_label}
                          </span>
                        )}
                        {stage.places != null && (
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-gold" /> {stage.places} places
                          </span>
                        )}
                        {stage.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-gold" /> {stage.location}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {stage.level && <Badge variant="secondary">{stage.level}</Badge>}
                        {stage.instructor && <Badge variant="default">{stage.instructor}</Badge>}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-center gap-3 md:items-end">
                      <span className="font-display text-2xl font-bold text-gold">
                        {formatPrice(stage.price_cents)}
                      </span>
                      <Link href="/reservation">
                        <Button variant="primary" size="sm">
                          Réserver
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
