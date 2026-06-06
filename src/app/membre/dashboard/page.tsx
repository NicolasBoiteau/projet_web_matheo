import { CalendarCheck, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { MyReservations } from "@/components/booking/MyReservations"
import { getUserReservations } from "@/lib/bookings.server"

export default async function DashboardPage() {
  const reservations = await getUserReservations()
  const now = new Date()

  const upcoming = reservations.filter(
    (r) =>
      r.booking_slots &&
      r.status !== "cancelled" &&
      new Date(r.booking_slots.start_time) >= now
  )
  const pending = reservations.filter((r) => r.status === "pending")
  const confirmed = reservations.filter((r) => r.status === "confirmed")

  const stats = [
    { icon: CalendarCheck, label: "Réservations à venir", value: upcoming.length, color: "text-gold" },
    { icon: Clock, label: "En attente", value: pending.length, color: "text-fir" },
    { icon: CheckCircle2, label: "Confirmées", value: confirmed.length, color: "text-gold" },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fir">Tableau de bord</h1>
      <p className="mt-1 text-sm text-gray-500">Bienvenue sur votre espace membre.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-fir/5">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/5">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-8 border-fir/5">
        <CardHeader>
          <h2 className="font-display text-lg font-bold text-fir">Mes réservations</h2>
        </CardHeader>
        <CardContent>
          <MyReservations reservations={reservations} />
        </CardContent>
      </Card>
    </div>
  )
}
