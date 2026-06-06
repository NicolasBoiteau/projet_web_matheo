import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, subject, message } = body

    // Validate
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      )
    }

    // Here you would:
    // 1. Send email via Resend / SendGrid / SMTP
    // 2. Store in database
    // 3. Notify the team

    console.log("Contact form submission:", { firstName, lastName, email, subject })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    )
  }
}