"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogIn, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : signInError.message
      )
      setIsLoading(false)
      return
    }

    // Rediriger les admins vers le back-office, les membres vers leur espace
    let destination = "/membre/dashboard"
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()
      if (profile?.role === "admin") destination = "/admin"
    }

    router.push(destination)
    router.refresh()
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
              <LogIn className="h-6 w-6 text-gold" />
            </div>
            <h1 className="font-display text-2xl font-bold text-fir">Connexion</h1>
            <p className="mt-2 text-sm text-gray-500">
              Accédez à votre espace membre
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-2">
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

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-fir">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 pr-10 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="Votre mot de passe"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-500">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold" />
                  Se souvenir de moi
                </label>
                <Link href="/mot-de-passe-oublie" className="text-gold hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-fir/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">Ou</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Continuer avec Google
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <Link href="/register" className="font-medium text-gold hover:underline">
                S&apos;inscrire
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}