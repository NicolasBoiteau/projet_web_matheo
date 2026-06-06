import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
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

  const { data: horses, error } = await supabase
    .from("horses")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ horses })
}

export async function POST(request: Request) {
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
    .insert({
      name: body.name,
      slug: body.slug,
      breed: body.breed || null,
      gender: body.gender || null,
      birth_year: body.birth_year || null,
      height_cm: body.height_cm || null,
      color: body.color || null,
      disciplines: body.disciplines || [],
      description: body.description || null,
      main_image_url: body.main_image_url || null,
      gallery_urls: body.gallery_urls || [],
      pedigree: body.pedigree || null,
      competition_level: body.competition_level || null,
      is_for_sale: body.is_for_sale || false,
      sale_price_cents: body.sale_price_cents || null,
      featured: body.featured || false,
      is_published: body.is_published ?? true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ horse: data })
}