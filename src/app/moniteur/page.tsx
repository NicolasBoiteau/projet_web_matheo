import Link from "next/link"
import { CalendarDays, CalendarClock, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { getMySlots } from "@/lib/bookings.server"

export default async function MoniteurDashboardPage() {
  const slots = await getMySlots()
  const now = new Date()
  const upcoming = slots.filter((s) => new Date(s.start_time) >= now)

  const stats = [
    { icon: CalendarDays, label: "Cours créés", value: slots.length },
    { icon: CalendarClock, label: "Cours à venir", value: upcoming.length },
  ]

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-fir">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez vos cours et créneaux.</p>
        </div>
        <Link
          href="/moniteur/cours/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
        >
          <Plus className="h-4 w-4" />
          Ajouter un cours
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-fir/5">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/5">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-fir">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8">
        <Link href="/moniteur/cours" className="text-sm font-medium text-gold hover:underline">
          Voir tous mes cours →
        </Link>
      </div>
    </div>
  )
}
