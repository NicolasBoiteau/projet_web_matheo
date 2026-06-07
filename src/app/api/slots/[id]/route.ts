import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Admins ET moniteurs peuvent gérer les créneaux (cours).
async function requireStaff() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié", status: 401 as const, supabase }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "admin" && profile?.role !== "instructor")
    return { error: "Accès refusé", status: 403 as const, supabase }

  return { supabase, user }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await requireStaff()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body = await request.json()

  const { data, error } = await auth.supabase
    .from("booking_slots")
    .update({
      slot_type: body.slot_type,
      title: body.title,
      description: body.description || null,
      start_time: body.start_time,
      end_time: body.end_time,
      max_participants: body.max_participants || 1,
      price_cents: body.price_cents || 0,
      is_available: body.is_available ?? true,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ slot: data })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await requireStaff()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { error } = await auth.supabase.from("booking_slots").delete().eq("id", id)

  if (error) {
    // Une réservation référence ce créneau (ON DELETE RESTRICT) → message clair
    return NextResponse.json(
      { error: "Impossible de supprimer : des réservations sont liées à ce créneau." },
      { status: 409 }
    )
  }

  return NextResponse.json({ success: true })
}
