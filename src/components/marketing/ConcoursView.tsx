"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Trophy, Medal, Award, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatDate } from "@/lib/utils/formatters"
import { splitConcours, sortPodium, rankLabel } from "@/lib/concours"
import type { Concours, PodiumEntry } from "@/lib/supabase/types"

const MEDAL: Record<number, { ring: string; bg: string; text: string; icon: typeof Medal }> = {
  1: { ring: "ring-gold/40", bg: "bg-gold/10", text: "text-gold", icon: Trophy },
  2: { ring: "ring-gray-300", bg: "bg-gray-100", text: "text-gray-500", icon: Medal },
  3: { ring: "ring-copper/40", bg: "bg-copper/10", text: "text-copper", icon: Award },
}

function PodiumRow({ entry }: { entry: PodiumEntry }) {
  const meta = MEDAL[entry.rank] ?? MEDAL[3]
  const Icon = meta.icon
  return (
    <div className={`flex items-center gap-3 rounded-xl ${meta.bg} px-3 py-2`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ${meta.ring}`}>
        <Icon className={`h-4 w-4 ${meta.text}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-fir">{entry.rider}</p>
        {entry.horse && <p className="truncate text-xs text-gray-500">{entry.horse}</p>}
      </div>
      <span className={`shrink-0 text-xs font-bold uppercase tracking-wide ${meta.text}`}>
        {rankLabel(entry.rank)}
      </span>
    </div>
  )
}

export function ConcoursView({ concours }: { concours: Concours[] }) {
  const { upcoming, past } = splitConcours(concours)

  return (
    <div>
      <PageHeader
        title="Concours & Palmarès"
        subtitle="Suivez les prochaines échéances de nos cavaliers et revivez leurs plus belles performances."
      />

      <section className="relative -mt-8 pb-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          {concours.length === 0 ? (
            <EmptyState
              icon={<Trophy className="h-10 w-10" />}
              title="Aucun concours pour le moment"
              description="Les prochains concours et résultats seront publiés ici très bientôt."
            />
          ) : (
            <div className="space-y-16">
              {/* -------- Prochains concours -------- */}
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-gold" />
                  <h2 className="font-display text-2xl font-bold text-fir sm:text-3xl">
                    Prochains concours
                  </h2>
                </div>

                {upcoming.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-fir/20 p-8 text-center text-gray-500">
                    Aucun concours programmé pour l&apos;instant — revenez bientôt&nbsp;!
                  </p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {upcoming.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                      >
                        <Card
                          className={`h-full border-fir/5 transition-all duration-300 hover:shadow-lg ${
                            c.is_featured ? "border-gold ring-1 ring-gold/30" : ""
                          }`}
                        >
                          <CardContent className="flex h-full flex-col p-6">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              {c.discipline && <Badge variant="default">{c.discipline}</Badge>}
                              {c.level && <Badge variant="secondary">{c.level}</Badge>}
                              {c.is_featured && (
                                <Badge variant="default" className="ml-auto">
                                  <Sparkles className="mr-1 h-3 w-3" /> À ne pas manquer
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-display text-xl font-bold text-fir">{c.name}</h3>
                            {c.description && (
                              <p className="mt-2 line-clamp-3 text-sm text-gray-600">{c.description}</p>
                            )}
                            <div className="mt-4 space-y-2 text-sm text-gray-500">
                              <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gold" />
                                {formatDate(c.event_date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                              </span>
                              {c.location && (
                                <span className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gold" /> {c.location}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* -------- Palmarès -------- */}
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-gold" />
                  <h2 className="font-display text-2xl font-bold text-fir sm:text-3xl">
                    Palmarès &amp; résultats
                  </h2>
                </div>

                {past.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-fir/20 p-8 text-center text-gray-500">
                    Les résultats des concours passés apparaîtront ici.
                  </p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {past.map((c, i) => {
                      const podium = sortPodium(c.podium)
                      return (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08, duration: 0.5 }}
                        >
                          <Card className="h-full border-fir/5 transition-all duration-300 hover:shadow-lg">
                            <CardContent className="flex h-full flex-col p-6">
                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                {c.discipline && <Badge variant="default">{c.discipline}</Badge>}
                                {c.level && <Badge variant="secondary">{c.level}</Badge>}
                              </div>
                              <h3 className="font-display text-xl font-bold text-fir">{c.name}</h3>
                              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gold" />
                                  {formatDate(c.event_date, { day: "numeric", month: "long", year: "numeric" })}
                                </span>
                                {c.location && (
                                  <span className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gold" /> {c.location}
                                  </span>
                                )}
                              </div>

                              {podium.length > 0 ? (
                                <div className="mt-4 space-y-2">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Podium
                                  </p>
                                  {podium.map((entry) => (
                                    <PodiumRow key={`${entry.rank}-${entry.rider}`} entry={entry} />
                                  ))}
                                </div>
                              ) : (
                                c.description && (
                                  <p className="mt-4 text-sm text-gray-600">{c.description}</p>
                                )
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
