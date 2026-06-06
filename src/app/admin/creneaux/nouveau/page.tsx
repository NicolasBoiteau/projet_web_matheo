import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SlotForm } from "@/components/admin/SlotForm"

export default function NouveauCreneauPage() {
  return (
    <div>
      <Link
        href="/admin/creneaux"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux créneaux
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold text-fir">Nouveau créneau</h1>
      <SlotForm />
    </div>
  )
}
