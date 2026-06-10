"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"

export default function ReinitialiserMotDePassePage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [validLink, setValidLink] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // Le client Supabase détecte automatiquement le jeton de récupération
  // présent dans l'URL (au chargement) et ouvre une session temporaire.
  useEffect(() => {
    const supabase = createClient()

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setValidLink(true)
        setReady(true)
      }
    })

    // Filet de sécurité : si l'événement est déjà passé, on vérifie la session.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setValidLink(true)
      setReady(true)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("8 caractères minimum.")
      return
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    setDone(true)
    setIsLoading(false)
    // On déconnecte la session temporaire puis on renvoie vers la connexion.
    await supabase.auth.signOut()
    setTimeout(() => router.push("/login"), 2500)
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
              {done ? (
                <CheckCircle2 className="h-6 w-6 text-gold" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-gold" />
              )}
            </div>
            <h1 className="font-display text-2xl font-bold text-fir">
              {done ? "Mot de passe modifié" : "Nouveau mot de passe"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {done
                ? "Vous allez être redirigé vers la page de connexion…"
                : "Choisissez un nouveau mot de passe pour votre compte."}
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {!ready ? (
              <p className="py-4 text-center text-sm text-gray-500">Vérification du lien…</p>
            ) : done ? (
              <Link href="/login">
                <Button variant="primary" className="w-full">
                  Aller à la connexion
                </Button>
              </Link>
            ) : !validLink ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  Ce lien est invalide ou a expiré. Demandez-en un nouveau.
                </div>
                <Link href="/mot-de-passe-oublie">
                  <Button variant="outline" className="w-full">
                    Renvoyer un lien
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
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-fir">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 pr-10 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      placeholder="8 caractères minimum"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-medium text-fir"
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="Confirmer"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
                  {isLoading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
