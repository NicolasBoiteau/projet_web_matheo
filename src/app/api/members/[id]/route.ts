import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

const ALLOWED_ROLES = ["admin", "member", "instructor"] as const
type Role = (typeof ALLOWED_ROLES)[number]

/** PATCH /api/members/[id] : change le rôle d'un compte (admin uniquement). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 1. L'appelant doit être admin (vérifié via sa session).
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (me?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  // 2. Validation du rôle demandé.
  const body = await request.json()
  const role = body.role as Role
  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 })
  }

  // 3. Sécurité : un admin ne peut pas changer son propre rôle (anti-verrouillage).
  if (id === user.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas modifier votre propre rôle." },
      { status: 400 }
    )
  }

  // 4. Mise à jour via le service_role (contourne la RLS proprement).
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select("id, role")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}
