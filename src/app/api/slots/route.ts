import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function requireAdmin() {
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
  if (profile?.role !== "admin")
    return { error: "Accès refusé", status: 403 as const, supabase }

  return { supabase, user }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body = await request.json()

  const { data, error } = await auth.supabase
    .from("booking_slots")
    .insert({
      slot_type: body.slot_type,
      title: body.title,
      description: body.description || null,
      start_time: body.start_time,
      end_time: body.end_time,
      max_participants: body.max_participants || 1,
      price_cents: body.price_cents || 0,
      is_available: body.is_available ?? true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ slot: data })
}
