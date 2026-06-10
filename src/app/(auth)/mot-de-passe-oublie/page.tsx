"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { KeyRound, ArrowLeft, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    })

    if (resetError) {
      setError(resetError.message)
      setIsLoading(false)
      return
    }

    // On affiche toujours un succès, même si l'email n'existe pas
    // (pour ne pas révéler quels comptes existent).
    setSent(true)
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-fir/5">
          <CardHeader className="pt-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
              {sent ? (
                <MailCheck className="h-6 w-6 text-gold" />
              ) : (
                <KeyRound className="h-6 w-6 text-gold" />
              )}
            </div>
            <h1 className="font-display text-2xl font-bold text-fir">
              {sent ? "Vérifiez votre boîte mail" : "Mot de passe oublié"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {sent
                ? "Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé."
                : "Indiquez votre email : nous vous enverrons un lien pour définir un nouveau mot de passe."}
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {sent ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  Pensez à regarder vos courriers indésirables (spam). Le lien est
                  valable une heure.
                </div>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-fir">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="votre@email.fr"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
                  {isLoading ? "Envoi..." : "Envoyer le lien"}
                </Button>

                <Link
                  href="/login"
                  className="mt-2 flex items-center justify-center text-sm text-gray-500 hover:text-gold"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Retour à la connexion
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
