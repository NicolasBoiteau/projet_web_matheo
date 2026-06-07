import "server-only"
import { Resend } from "resend"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { BookingSlot } from "@/lib/supabase/types"
import { SLOT_TYPE_LABELS } from "@/lib/bookings"
import { SITE_CONFIG } from "@/lib/utils/constants"

/**
 * Envoi d'emails transactionnels via Resend.
 *
 * Configuration (variables d'env) :
 *  - RESEND_API_KEY : clé API Resend (re_...)
 *  - EMAIL_FROM     : expéditeur. En mode test : "O'TAKEY <onboarding@resend.dev>"
 *                     (n'envoie qu'à l'adresse du compte Resend). En prod : une
 *                     adresse de ton domaine vérifié, ex "O'TAKEY <contact@otakey.fr>".
 *
 * Sans RESEND_API_KEY, les fonctions ne font rien (no-op) : le site continue de
 * tourner, les réservations sont créées même si l'email n'est pas configuré.
 */

const FROM = process.env.EMAIL_FROM || "O'TAKEY <onboarding@resend.dev>"

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

/** "samedi 14 juin 2026 à 14h00" */
function formatSlotDate(iso: string): string {
  return format(new Date(iso), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })
}

const GOLD = "#C5A55A"
const FIR = "#1B3A2D"

/** Gabarit HTML commun (entête + pied de page de marque). */
function layout(title: string, bodyHtml: string): string {
  return `
  <div style="background:#F7F4EE;padding:32px 0;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e7e2d6;">
          <tr>
            <td style="background:${FIR};padding:24px 32px;">
              <span style="color:${GOLD};font-size:20px;font-weight:bold;letter-spacing:1px;">${SITE_CONFIG.name}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:22px;color:${FIR};">${title}</h1>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#faf8f3;border-top:1px solid #e7e2d6;font-size:12px;color:#6b7280;">
              ${SITE_CONFIG.name} — ${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.postalCode} ${SITE_CONFIG.address.city}<br/>
              Cet email vous est envoyé suite à une réservation sur ${SITE_CONFIG.url}.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </div>`
}

/** Bloc récapitulatif d'un créneau (réutilisé par les deux emails). */
function slotBlock(slot: BookingSlot, participants?: number): string {
  const rows: Array<[string, string]> = [
    ["Activité", `${slot.title}${SLOT_TYPE_LABELS[slot.slot_type] ? ` (${SLOT_TYPE_LABELS[slot.slot_type]})` : ""}`],
    ["Date", formatSlotDate(slot.start_time)],
  ]
  if (participants) rows.push(["Participant(s)", String(participants)])

  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:#6b7280;width:120px;">${k}</td><td style="padding:6px 0;font-weight:bold;">${v}</td></tr>`
    )
    .join("")

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;font-size:15px;width:100%;background:#faf8f3;border-radius:8px;padding:8px 16px;">${trs}</table>`
}

type ConfirmationParams = {
  to: string
  firstName?: string | null
  slot: BookingSlot
  participants: number
}

/** Email de confirmation, envoyé dès la création de la réservation. */
export async function sendReservationConfirmation(
  params: ConfirmationParams
): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const hello = params.firstName ? `Bonjour ${params.firstName},` : "Bonjour,"
  const html = layout(
    "Votre réservation est bien enregistrée",
    `<p>${hello}</p>
     <p>Nous avons bien reçu votre demande de réservation. Elle est <strong>en attente de confirmation</strong> par notre équipe ; vous recevrez un rappel la veille de la séance.</p>
     ${slotBlock(params.slot, params.participants)}
     <p>Le règlement s'effectue sur place. À très vite aux écuries !</p>`
  )

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Réservation enregistrée — ${params.slot.title}`,
      html,
    })
  } catch (err) {
    console.error("[email] confirmation échouée:", err)
  }
}

type ReminderParams = {
  to: string
  firstName?: string | null
  slot: BookingSlot
}

/** Email de rappel, envoyé la veille de la séance par le cron. */
export async function sendReservationReminder(
  params: ReminderParams
): Promise<boolean> {
  const resend = getResend()
  if (!resend) return false

  const hello = params.firstName ? `Bonjour ${params.firstName},` : "Bonjour,"
  const html = layout(
    "Rappel : votre séance approche",
    `<p>${hello}</p>
     <p>Petit rappel pour votre séance prévue <strong>demain</strong> :</p>
     ${slotBlock(params.slot)}
     <p>Pensez à arriver quelques minutes en avance. En cas d'empêchement, prévenez-nous dès que possible. À demain !</p>`
  )

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Rappel — ${params.slot.title} demain`,
      html,
    })
    if (error) {
      console.error("[email] rappel échoué:", error)
      return false
    }
    return true
  } catch (err) {
    console.error("[email] rappel échoué:", err)
    return false
  }
}
