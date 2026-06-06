import { NextResponse } from "next/server"

export async function GET() {
  // In production, fetch from Sanity
  return NextResponse.json({
    message: "Bienvenue aux Écuries du O'TAKEY — Prochains stages disponibles !",
    isActive: true,
    dismissible: true,
  })
}