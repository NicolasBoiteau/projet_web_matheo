import Link from "next/link"
import { Plus } from "lucide-react"
import { SlotsTable } from "@/components/admin/SlotsTable"
import { getMySlots } from "@/lib/bookings.server"

export default async function MoniteurCoursPage() {
  const slots = await getMySlots()

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-fir sm:text-3xl">Mes cours</h1>
        <Link
          href="/moniteur/cours/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
        >
          <Plus className="h-4 w-4" />
          Ajouter un cours
        </Link>
      </div>

      <SlotsTable slots={slots} basePath="/moniteur/cours" />
    </div>
  )
}
