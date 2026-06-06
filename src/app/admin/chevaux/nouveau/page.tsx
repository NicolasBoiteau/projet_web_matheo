import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { HorseForm } from "@/components/admin/HorseForm"

export default function NouveauChevalPage() {
  return (
    <div>
      <Link
        href="/admin/chevaux"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold text-fir">Nouveau cheval</h1>
      <HorseForm />
    </div>
  )
}
