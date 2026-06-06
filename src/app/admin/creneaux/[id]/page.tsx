import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SlotForm } from "@/components/admin/SlotForm"
import type { BookingSlot } from "@/lib/supabase/types"

export default async function EditCreneauPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: slot } = await supabase.from("booking_slots").select("*").eq("id", id).single()

  if (!slot) {
    notFound()
  }

  return (
    <div>
      <Link
        href="/admin/creneaux"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux créneaux
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold text-fir">
        Modifier {(slot as BookingSlot).title}
      </h1>
      <SlotForm initialData={slot as BookingSlot} />
    </div>
  )
}
