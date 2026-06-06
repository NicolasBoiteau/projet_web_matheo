import { PageHeader } from "@/components/shared/PageHeader"
import { BookingForm } from "@/components/booking/BookingForm"
import { getAvailableSlots } from "@/lib/bookings.server"

export const metadata = {
  title: "Réservation en ligne",
}

// Les créneaux changent souvent : pas de mise en cache statique.
export const dynamic = "force-dynamic"

export default async function ReservationPage() {
  const slots = await getAvailableSlots()

  return (
    <div>
      <PageHeader
        title="Réservation en ligne"
        subtitle="Réservez votre cours, stage ou location de carrière. Le règlement s'effectue sur place."
      />

      <section className="relative -mt-8 pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <BookingForm slots={slots} />
        </div>
      </section>
    </div>
  )
}
