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
  const isInstructor = profile?.role === "instructor"

  // Niveau de droit : l'admin gère tout ; le moniteur gère les réservations de
  // SES cours ; le membre ne peut qu'annuler sa propre réservation.
  // « staff » = peut passer n'importe quel statut. On écrit alors via le client
  // admin (le moniteur n'a pas le droit RLS de modifier la résa d'un autre).
  let isStaff = isAdmin
  let useAdminWrite = false

  if (isInstructor && !isAdmin) {
    const admin = createAdminClient()
    const { data: resv } = await admin
      .from("reservations")
      .select("slot_id")
      .eq("id", id)
      .single()
    if (resv?.slot_id) {
      const { data: slot } = await admin
        .from("booking_slots")
        .select("instructor_id")
        .eq("id", resv.slot_id)
        .single()
      if (slot?.instructor_id === user.id) {
        isStaff = true
        useAdminWrite = true
      }
    }
  }

  if (!isStaff && status !== "cancelled") {
    return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
  }

  const update: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (status === "cancelled") {
    update.cancelled_at = new Date().toISOString()
  }

  // Admin / membre : client utilisateur (RLS applique les droits).
  // Moniteur propriétaire du cours : client admin (RLS ne le couvre pas).
  const writer = useAdminWrite ? createAdminClient() : supabase
  const { data, error } = await writer
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

  // Notifie le membre quand l'équipe (admin ou moniteur) confirme ou annule.
  // (Best-effort : un échec d'email n'invalide jamais la mise à jour.)
  if (isStaff && (status === "confirmed" || status === "cancelled")) {
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
