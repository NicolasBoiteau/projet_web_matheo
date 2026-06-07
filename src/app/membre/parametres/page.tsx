"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
import { avatarUrl } from "@/lib/avatar"

const inputClass =
  "w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:bg-gray-50 disabled:text-gray-400"

export default function ParametresPage() {
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email ?? "")
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone")
          .eq("id", user.id)
          .single()
        if (profile) {
          setFirstName(profile.first_name ?? "")
          setLastName(profile.last_name ?? "")
          setPhone(profile.phone ?? "")
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg(null)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setProfileMsg({ type: "err", text: "Session expirée, reconnectez-vous." })
      setSavingProfile(false)
      return
    }
    const { error } = await supabase
      .from("profiles")
      .update({ first_name: firstName, last_name: lastName, phone: phone || null })
      .eq("id", user.id)
    setProfileMsg(
      error
        ? { type: "err", text: error.message }
        : { type: "ok", text: "Profil mis à jour." }
    )
    setSavingProfile(false)
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg(null)
    if (password.length < 8) {
      setPasswordMsg({ type: "err", text: "8 caractères minimum." })
      return
    }
    if (password !== confirmPassword) {
      setPasswordMsg({ type: "err", text: "Les mots de passe ne correspondent pas." })
      return
    }
    setSavingPassword(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setPasswordMsg({ type: "err", text: error.message })
    } else {
      setPasswordMsg({ type: "ok", text: "Mot de passe mis à jour." })
      setPassword("")
      setConfirmPassword("")
    }
    setSavingPassword(false)
  }

  const fullName = `${firstName} ${lastName}`.trim()

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fir">Paramètres</h1>
      <p className="mt-1 text-sm text-gray-500">Gérez votre profil et vos préférences.</p>

      {/* Avatar */}
      <div className="mt-6 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl(email || fullName)}
          alt=""
          className="h-16 w-16 shrink-0 rounded-full border border-fir/10 bg-cream"
        />
        <div>
          <p className="font-medium text-fir">{fullName || "Votre profil"}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      <Card className="mt-6 border-fir/5">
        <CardHeader>
          <h2 className="font-display text-lg font-bold text-fir">Informations personnelles</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleProfileSave}>
            {profileMsg && (
              <div
                className={
                  profileMsg.type === "ok"
                    ? "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                    : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                }
              >
                {profileMsg.text}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Prénom</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Nom</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Email</label>
                <input type="email" value={email} disabled className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>
            <Button type="submit" variant="primary" loading={savingProfile} disabled={loading}>
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 border-fir/5">
        <CardHeader>
          <h2 className="font-display text-lg font-bold text-fir">Sécurité</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordSave}>
            {passwordMsg && (
              <div
                className={
                  passwordMsg.type === "ok"
                    ? "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                    : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                }
              >
                {passwordMsg.text}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="8 caractères minimum"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Confirmer"
                />
              </div>
            </div>
            <Button type="submit" variant="primary" loading={savingPassword}>
              Mettre à jour
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
