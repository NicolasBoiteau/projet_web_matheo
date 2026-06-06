import { ReservationsTable } from "@/components/admin/ReservationsTable"
import { getAllReservations } from "@/lib/bookings.server"

export default async function AdminReservationsPage() {
  const reservations = await getAllReservations()

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-fir">Réservations</h1>
      <ReservationsTable reservations={reservations} />
    </div>
  )
}
