"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/shared/PageHeader"
import { formatPrice } from "@/lib/utils/formatters"
import type { PensionPack } from "@/lib/supabase/types"

export function PensionsView({ packs }: { packs: PensionPack[] }) {
  return (
    <div>
      <PageHeader
        title="Nos Pensions"
        subtitle="Des solutions sur-mesure pour le bien-être de votre cheval. Box premium, paddock paradise ou pack compétition : choisissez la formule qui vous correspond."
      />

      <section className="relative -mt-8 pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {packs.map((pack, i) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex"
              >
                <Card
                  className={`relative flex w-full flex-col ${
                    pack.is_featured ? "border-gold shadow-xl shadow-gold/10 md:scale-105" : "border-fir/10"
                  }`}
                >
                  {pack.is_featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="default" className="bg-gold px-4 py-1 text-sm font-bold text-black">
                        Le plus populaire
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8 text-center">
                    <h3 className="font-display text-xl font-bold text-fir">{pack.name}</h3>
                    <div className="mt-4">
                      <span className="font-display text-4xl font-bold text-fir">
                        {formatPrice(pack.price_cents)}
                      </span>
                      <span className="text-gray-500">/mois</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {pack.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pb-8">
                    <Link href="/contact" className="w-full">
                      <Button variant={pack.is_featured ? "primary" : "outline"} className="w-full">
                        Choisir ce pack
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-gray-500">
            Tous nos packs incluent l&apos;accès aux installations et la surveillance vétérinaire.
            Contactez-nous pour un devis personnalisé.
          </p>
        </div>
      </section>
    </div>
  )
}
