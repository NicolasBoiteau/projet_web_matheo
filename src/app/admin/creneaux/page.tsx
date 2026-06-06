import Link from "next/link"
import { Plus } from "lucide-react"
import { SlotsTable } from "@/components/admin/SlotsTable"
import { getAllSlots } from "@/lib/bookings.server"

export default async function AdminCreneauxPage() {
  const slots = await getAllSlots()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-fir">Créneaux</h1>
        <Link
          href="/admin/creneaux/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
        >
          <Plus className="h-4 w-4" />
          Ajouter un créneau
        </Link>
      </div>

      <SlotsTable slots={slots} />
    </div>
  )
}
