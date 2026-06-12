import { NextResponse } from "next/server"

export async function GET() {
  // Bannière statique (le contenu marketing dynamique passe par le CMS Supabase).
  return NextResponse.json({
    message: "Bienvenue aux Écuries Arantino — Prochains stages disponibles !",
    isActive: true,
    dismissible: true,
  })
}