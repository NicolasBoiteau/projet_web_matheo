import { Card, CardContent } from "@/components/ui/Card"
import { MemberPlanning } from "@/components/booking/MemberPlanning"
import { getUserReservations } from "@/lib/bookings.server"
import { reservationsToEvents } from "@/lib/bookings"

export default async function PlanningPage() {
  const reservations = await getUserReservations()
  const events = reservationsToEvents(reservations)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fir">Mon planning</h1>
      <p className="mt-1 text-sm text-gray-500">
        Visualisez vos cours et réservations à venir.
      </p>

      <Card className="mt-6 border-fir/5">
        <CardContent className="p-6">
          <MemberPlanning events={events} />
        </CardContent>
      </Card>
    </div>
  )
}
