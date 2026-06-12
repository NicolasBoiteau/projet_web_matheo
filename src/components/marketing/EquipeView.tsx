"use client"

import { motion } from "framer-motion"
import { Mail, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/shared/PageHeader"
import type { TeamMember } from "@/lib/supabase/types"

export function EquipeView({ members }: { members: TeamMember[] }) {
  return (
    <div>
      <PageHeader
        title="Notre Équipe"
        subtitle="Des professionnels passionnés à votre service. Découvrez les visages des Écuries Arantino."
      />

      <section className="relative -mt-8 pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Card className="group h-full border-fir/5 transition-all duration-300 hover:border-gold/30 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold/20 to-fir/20 text-gold">
                      {member.portrait_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.portrait_url} alt={member.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-display text-3xl font-bold text-fir">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl font-bold text-fir">{member.name}</h3>
                    {member.role && <p className="text-sm font-medium text-gold">{member.role}</p>}

                    {member.specialties.length > 0 && (
                      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                        {member.specialties.map((s) => (
                          <Badge key={s} variant="secondary">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {member.bio && (
                      <p className="mt-4 text-sm leading-relaxed text-gray-600">{member.bio}</p>
                    )}

                    {member.diplomas.length > 0 && (
                      <div className="mt-4 border-t border-fir/10 pt-4">
                        <p className="mb-2 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-fir">
                          <Award className="h-3.5 w-3.5" />
                          Diplômes
                        </p>
                        <div className="flex flex-wrap justify-center gap-1">
                          {member.diplomas.map((d) => (
                            <span key={d} className="rounded-md bg-fir/5 px-2 py-0.5 text-xs text-fir-light">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {member.email && (
                      <div className="mt-4">
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-dark"
                        >
                          <Mail className="h-4 w-4" />
                          Contacter
                        </a>
                      </div>
                    )}
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
