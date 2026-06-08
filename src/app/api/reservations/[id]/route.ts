import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendReservationStatusUpdate } from "@/lib/email"
import type { BookingSlot } from "@/lib/supabase/types"

const VALID_STATUSES = ["pending", "confirmed", "cancelled", "completed", "no_show"]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const body = await request.json()
  const status = body.status as string

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  const isAdmin = profile?.role === "admin"

  // Un membre ne peut qu'annuler sa propre réservation
  if (!isAdmin && status !== "cancelled") {
    return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
  }

  const update: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (status === "cancelled") {
    update.cancelled_at = new Date().toISOString()
  }

  // RLS : un membre ne peut modifier que ses propres réservations, l'admin toutes.
  const { data, error } = await supabase
    .from("reservations")
    .update(update)
    .eq("id", id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Réservation introuvable" },
      { status: 404 }
    )
  }

  // Notifie le membre quand l'équipe confirme ou annule sa réservation.
  // (Best-effort : un échec d'email n'invalide jamais la mise à jour.)
  if (isAdmin && (status === "confirmed" || status === "cancelled")) {
    try {
      const admin = createAdminClient()
      const [{ data: slot }, { data: member }] = await Promise.all([
        admin.from("booking_slots").select("*").eq("id", data.slot_id).single<BookingSlot>(),
        admin.from("profiles").select("email, first_name").eq("id", data.user_id).single(),
      ])
      if (slot && member?.email) {
        await sendReservationStatusUpdate({
          to: member.email,
          firstName: member.first_name,
          slot,
          status,
        })
      }
    } catch (err) {
      console.error("[reservations] notification de statut échouée:", err)
    }
  }

  return NextResponse.json({ reservation: data })
}
