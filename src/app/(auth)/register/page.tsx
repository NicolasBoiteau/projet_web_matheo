"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { UserPlus, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }

    // Si la confirmation d'email est requise, aucune session n'est créée.
    if (data.session) {
      router.push("/membre/dashboard")
      router.refresh()
    } else {
      setSuccess(true)
      setIsLoading(false)
    }
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
              <UserPlus className="h-6 w-6 text-gold" />
            </div>
            <h1 className="font-display text-2xl font-bold text-fir">Inscription</h1>
            <p className="mt-2 text-sm text-gray-500">
              Créez votre compte pour accéder à l&apos;espace membre
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-fir">Prénom</label>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-fir">Nom</label>
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="votre@email.fr"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="06 XX XX XX XX"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
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
                <label className="mb-1.5 block text-sm font-medium text-fir">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-500">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                />
                J&apos;accepte les{" "}
                <Link href="#" className="text-gold hover:underline">
                  conditions d&apos;utilisation
                </Link>
              </label>

              <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
                {isLoading ? "Inscription..." : "Créer mon compte"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Déjà un compte ?{" "}
              <Link href="/login" className="font-medium text-gold hover:underline">
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}