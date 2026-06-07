import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/horses"
import { sendReservationReminder, isEmailConfigured } from "@/lib/email"
import type { BookingSlot, Profile } from "@/lib/supabase/types"

/**
 * Cron Vercel (1×/jour) : envoie un rappel pour les séances à venir dans les
 * ~36 prochaines heures (donc "la veille" quand le cron tourne en fin de
 * journée), pour les réservations actives non encore rappelées.
 *
 * Sécurité : Vercel ajoute l'en-tête "Authorization: Bearer $CRON_SECRET"
 * quand la variable CRON_SECRET est définie. On refuse tout appel non signé.
 *
 * Configuration du planning : voir vercel.json.
 */

// Empêche toute mise en cache de la route.
export const dynamic = "force-dynamic"

const REMINDER_WINDOW_HOURS = 36

type Row = {
  id: string
  status: string
  reminder_sent_at: string | null
  booking_slots: BookingSlot | null
  profiles: Pick<Profile, "email" | "first_name"> | null
}

export async function GET(request: Request) {
  // 1. Authentification du cron.
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get("authorization")
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ skipped: "supabase non configuré" })
  }
  if (!isEmailConfigured()) {
    return NextResponse.json({ skipped: "email (Resend) non configuré" })
  }

  const admin = createAdminClient()
  const now = new Date()
  const until = new Date(now.getTime() + REMINDER_WINDOW_HOURS * 3600 * 1000)

  // 2. Réservations actives, séance dans la fenêtre, pas encore rappelées.
  const { data, error } = await admin
    .from("reservations")
    .select("id, status, reminder_sent_at, booking_slots(*), profiles(email, first_name)")
    .in("status", ["pending", "confirmed"])
    .is("reminder_sent_at", null)
    .gte("booking_slots.start_time", now.toISOString())
    .lte("booking_slots.start_time", until.toISOString())

  if (error) {
    console.error("[cron/reminders]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = (data as unknown as Row[]) ?? []
  let sent = 0
  let failed = 0

  // 3. Envoi + marquage anti-doublon.
  for (const r of rows) {
    // Le filtre sur la table jointe peut laisser passer des lignes sans créneau.
    if (!r.booking_slots || !r.profiles?.email) continue

    const ok = await sendReservationReminder({
      to: r.profiles.email,
      firstName: r.profiles.first_name,
      slot: r.booking_slots,
    })

    if (ok) {
      await admin
        .from("reservations")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", r.id)
      sent++
    } else {
      failed++
    }
  }

  return NextResponse.json({ checked: rows.length, sent, failed })
}
