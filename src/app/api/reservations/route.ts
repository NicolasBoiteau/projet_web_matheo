import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendReservationConfirmation } from "@/lib/email"
import type { BookingSlot } from "@/lib/supabase/types"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const body = await request.json()
  const slotId = body.slot_id as string
  const participants = Math.max(1, Number(body.participants) || 1)

  if (!slotId) {
    return NextResponse.json({ error: "Créneau manquant" }, { status: 400 })
  }

  // Réservation atomique côté DB : le contrôle de capacité et l'insertion se
  // font dans une seule transaction avec verrou de ligne (cf. migration 012),
  // ce qui élimine tout risque de surbooking en cas de demandes concurrentes.
  const { data, error } = await supabase
    .rpc("create_reservation", {
      p_slot_id: slotId,
      p_participants: participants,
      p_notes: body.notes || null,
    })
    .single()

  if (error) {
    const msg = error.message || ""
    if (msg.includes("not_authenticated")) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    if (msg.includes("slot_not_found")) {
      return NextResponse.json({ error: "Créneau introuvable" }, { status: 404 })
    }
    if (msg.includes("slot_unavailable")) {
      return NextResponse.json({ error: "Ce créneau n'est plus disponible." }, { status: 400 })
    }
    if (msg.includes("slot_full")) {
      const remaining = msg.split("slot_full:")[1]?.trim() ?? "0"
      return NextResponse.json(
        { error: `Plus assez de places (${remaining} restante(s)).` },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: msg || "Réservation impossible" }, { status: 500 })
  }

  // Email de confirmation (best-effort : n'empêche jamais la réservation).
  const [{ data: profile }, { data: slot }] = await Promise.all([
    supabase.from("profiles").select("first_name").eq("id", user.id).single(),
    supabase.from("booking_slots").select("*").eq("id", slotId).single<BookingSlot>(),
  ])

  if (user.email && slot) {
    await sendReservationConfirmation({
      to: user.email,
      firstName: profile?.first_name ?? null,
      slot,
      participants,
    })
  }

  return NextResponse.json({ reservation: data })
}
