import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: horse, error } = await supabase
    .from("horses")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: "Cheval non trouvé" }, { status: 404 })
  }

  return NextResponse.json({ horse })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from("horses")
    .update({
      name: body.name,
      slug: body.slug,
      breed: body.breed,
      gender: body.gender,
      birth_year: body.birth_year,
      height_cm: body.height_cm,
      color: body.color,
      disciplines: body.disciplines,
      description: body.description,
      main_image_url: body.main_image_url,
      gallery_urls: body.gallery_urls,
      pedigree: body.pedigree,
      competition_level: body.competition_level,
      is_for_sale: body.is_for_sale ?? false,
      sale_price_cents: body.sale_price_cents,
      featured: body.featured ?? false,
      is_published: body.is_published ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ horse: data })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const { error } = await supabase
    .from("horses")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}