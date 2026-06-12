import Link from "next/link"
import { Container, Tag, CalendarDays, ClipboardList, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const nowIso = new Date().toISOString()
  const [{ data: horses }, { count: slotsCount }, { count: pendingCount }] = await Promise.all([
    supabase.from("horses").select("is_for_sale"),
    supabase
      .from("booking_slots")
      .select("id", { count: "exact", head: true })
      .eq("is_available", true)
      .gte("start_time", nowIso),
    supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ])

  const total = horses?.length ?? 0
  const forSale = horses?.filter((h) => h.is_for_sale).length ?? 0

  const stats = [
    { label: "Chevaux", value: total, icon: Container },
    { label: "À vendre", value: forSale, icon: Tag },
    { label: "Créneaux à venir", value: slotsCount ?? 0, icon: CalendarDays },
    { label: "Résa en attente", value: pendingCount ?? 0, icon: ClipboardList },
  ]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-fir">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">Gestion de la cavalerie Arantino</p>
        </div>
        <Link
          href="/admin/chevaux/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
        >
          <Plus className="h-4 w-4" />
          Ajouter un cheval
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-fir/10 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-fir">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-fir/10 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-fir">Accès rapide</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/chevaux"
            className="rounded-xl border border-fir/10 px-4 py-2.5 text-sm font-medium text-fir transition-colors hover:bg-fir/5"
          >
            Gérer les chevaux
          </Link>
          <Link
            href="/admin/creneaux"
            className="rounded-xl border border-fir/10 px-4 py-2.5 text-sm font-medium text-fir transition-colors hover:bg-fir/5"
          >
            Gérer les créneaux
          </Link>
          <Link
            href="/admin/reservations"
            className="rounded-xl border border-fir/10 px-4 py-2.5 text-sm font-medium text-fir transition-colors hover:bg-fir/5"
          >
            Voir les réservations
          </Link>
        </div>
      </div>
    </div>
  )
}
