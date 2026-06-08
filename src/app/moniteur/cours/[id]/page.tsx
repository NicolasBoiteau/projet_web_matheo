import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getSlotParticipants } from "@/lib/bookings.server"
import { SlotForm } from "@/components/admin/SlotForm"
import { SlotRoster } from "@/components/admin/SlotRoster"
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

  const typedSlot = slot as BookingSlot
  // Sûr : l'accès au créneau vient d'être vérifié (moniteur propriétaire).
  const participants = await getSlotParticipants(id)

  return (
    <div>
      <Link
        href="/moniteur/cours"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à mes cours
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold text-fir">
        Modifier {typedSlot.title}
      </h1>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SlotForm initialData={typedSlot} basePath="/moniteur/cours" />
        </div>
        <div className="lg:col-span-2">
          <SlotRoster
            reservations={participants}
            maxParticipants={typedSlot.max_participants}
          />
        </div>
      </div>
    </div>
  )
}
