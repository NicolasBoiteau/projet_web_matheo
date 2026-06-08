import { ReservationsTable } from "@/components/admin/ReservationsTable"
import { getInstructorReservations } from "@/lib/bookings.server"

export default async function MoniteurReservationsPage() {
  const reservations = await getInstructorReservations()
  const pending = reservations.filter((r) => r.status === "pending").length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-fir sm:text-3xl">
          Demandes de réservation
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {pending > 0
            ? `${pending} demande(s) en attente de votre validation.`
            : "Aucune demande en attente."}
        </p>
      </div>

      <ReservationsTable reservations={reservations} />
    </div>
  )
}
