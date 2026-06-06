"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-fir/5 text-center">
          <CardContent className="p-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="font-display text-2xl font-bold text-fir">
              Réservation confirmée !
            </h1>
            <p className="mt-3 text-gray-600">
              Votre réservation a bien été prise en compte. Vous allez recevoir un email de confirmation.
            </p>

            <div className="my-8 rounded-xl bg-gold/5 p-4 text-left">
              <h3 className="mb-3 font-semibold text-fir">Récapitulatif</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Service</span>
                  <span className="font-medium text-fir">Cours particulier CSO</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium text-fir">15 Juin 2026</span>
                </div>
                <div className="flex justify-between">
                  <span>Horaire</span>
                  <span className="font-medium text-fir">14h00 - 15h30</span>
                </div>
                <div className="flex justify-between">
                  <span>Montant</span>
                  <span className="font-medium text-gold">50€</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/membre/dashboard">
                <Button variant="primary" className="w-full">
                  Voir dans mon espace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/reservation">
                <Button variant="outline" className="w-full">
                  Réserver autre chose
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}