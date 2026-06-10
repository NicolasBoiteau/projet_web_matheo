import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildConcoursPayload } from "@/lib/concours"

// Admins ET moniteurs peuvent gérer les concours.
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
  if (!body.name || !body.event_date) {
    return NextResponse.json(
      { error: "Le nom et la date du concours sont obligatoires." },
      { status: 400 }
    )
  }

  const { data, error } = await auth.supabase
    .from("concours")
    .update({ ...buildConcoursPayload(body), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ concours: data })
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

  const { error } = await auth.supabase.from("concours").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
