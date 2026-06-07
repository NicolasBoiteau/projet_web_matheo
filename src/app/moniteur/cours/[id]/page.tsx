import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SlotForm } from "@/components/admin/SlotForm"
import type { BookingSlot } from "@/lib/supabase/types"

export default async function EditCoursPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: slot } = await supabase
    .from("booking_slots")
    .select("*")
    .eq("id", id)
    .single()

  // Un moniteur ne modifie que ses propres cours.
  if (!slot || (slot as BookingSlot).instructor_id !== user.id) {
    notFound()
  }

  return (
    <div>
      <Link
        href="/moniteur/cours"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à mes cours
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold text-fir">
        Modifier {(slot as BookingSlot).title}
      </h1>
      <SlotForm initialData={slot as BookingSlot} basePath="/moniteur/cours" />
    </div>
  )
}
