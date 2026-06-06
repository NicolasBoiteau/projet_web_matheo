"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function ParametresPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fir">Paramètres</h1>
      <p className="mt-1 text-sm text-gray-500">Gérez votre profil et vos préférences.</p>

      <Card className="mt-6 border-fir/5">
        <CardHeader>
          <h2 className="font-display text-lg font-bold text-fir">Informations personnelles</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Prénom</label>
                <input
                  defaultValue="Jean"
                  className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Nom</label>
                <input
                  defaultValue="Dupont"
                  className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Email</label>
                <input
                  type="email"
                  defaultValue="jean.dupont@email.fr"
                  className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">Téléphone</label>
                <input
                  type="tel"
                  defaultValue="06 12 34 56 78"
                  className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>
            <Button variant="primary">Enregistrer</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 border-fir/5">
        <CardHeader>
          <h2 className="font-display text-lg font-bold text-fir">Sécurité</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="8 caractères minimum"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fir">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Confirmer"
                />
              </div>
            </div>
            <Button variant="primary">Mettre à jour</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}