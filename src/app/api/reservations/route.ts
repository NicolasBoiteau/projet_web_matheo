import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSlotRemaining } from "@/lib/bookings.server"
import { sendReservationConfirmation } from "@/lib/email"

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

  const info = await getSlotRemaining(slotId)
  if (!info) {
    return NextResponse.json({ error: "Créneau introuvable" }, { status: 404 })
  }

  const { slot, remaining } = info

  if (!slot.is_available || new Date(slot.start_time) < new Date()) {
    return NextResponse.json({ error: "Ce créneau n'est plus disponible." }, { status: 400 })
  }

  if (participants > remaining) {
    return NextResponse.json(
      { error: `Plus assez de places (${remaining} restante(s)).` },
      { status: 409 }
    )
  }

  // Insertion via la session du membre → RLS garantit user_id = auth.uid()
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      user_id: user.id,
      slot_id: slotId,
      status: "pending",
      participants,
      notes: body.notes || null,
      amount_cents: slot.price_cents * participants,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Email de confirmation (best-effort : n'empêche jamais la réservation).
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single()

  if (user.email) {
    await sendReservationConfirmation({
      to: user.email,
      firstName: profile?.first_name ?? null,
      slot,
      participants,
    })
  }

  return NextResponse.json({ reservation: data })
}
