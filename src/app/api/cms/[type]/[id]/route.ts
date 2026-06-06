import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CMS_TABLES, isCmsType, pickFields } from "@/lib/cms"

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params
  if (!isCmsType(type)) {
    return NextResponse.json({ error: "Type inconnu" }, { status: 404 })
  }

  const auth = await requireAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body = await request.json()
  const payload = { ...pickFields(type, body), updated_at: new Date().toISOString() }

  const { data, error } = await auth.supabase
    .from(CMS_TABLES[type].table)
    .update(payload)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params
  if (!isCmsType(type)) {
    return NextResponse.json({ error: "Type inconnu" }, { status: 404 })
  }

  const auth = await requireAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { error } = await auth.supabase.from(CMS_TABLES[type].table).delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
