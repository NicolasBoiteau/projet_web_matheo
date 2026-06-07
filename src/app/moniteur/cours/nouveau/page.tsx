import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SlotForm } from "@/components/admin/SlotForm"

export default function NouveauCoursPage() {
  return (
    <div>
      <Link
        href="/moniteur/cours"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à mes cours
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold text-fir">Nouveau cours</h1>
      <SlotForm basePath="/moniteur/cours" />
    </div>
  )
}
