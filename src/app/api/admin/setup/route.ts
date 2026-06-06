import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  // Verify setup secret to prevent unauthorized access
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (secret !== process.env.ADMIN_SETUP_SECRET) {
    return NextResponse.json({ error: "Secret invalide" }, { status: 401 })
  }

  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    return NextResponse.json(
      { error: "ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis" },
      { status: 500 }
    )
  }

  try {
    const supabase = createAdminClient()

    // Check if admin already exists
    const { data: existingProfiles } = await supabase
      .from("profiles")
      .select("email, role")
      .eq("role", "admin")
      .limit(1)

    if (existingProfiles && existingProfiles.length > 0) {
      return NextResponse.json(
        {
          message: "Un administrateur existe déjà",
          admin: { email: existingProfiles[0].email },
          hint: "Connectez-vous avec cet email ou supprimez-le depuis Supabase Dashboard",
        },
        { status: 409 }
      )
    }

    // Create the admin user
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser(
      {
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: "Admin",
          last_name: "O'Takey",
        },
      }
    )

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    if (!authUser.user) {
      return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 })
    }

    // The trigger handle_new_user() should have created a profile row.
    // Update it to set role = 'admin'
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: "admin", first_name: "Admin", last_name: "O'Takey" })
      .eq("id", authUser.user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Compte administrateur créé avec succès",
      admin: {
        email,
        password,
      },
      instructions: [
        "1. Allez sur http://localhost:3000/login",
        `2. Connectez-vous avec ${email} / ${password}`,
        "3. Accédez à /admin/chevaux pour gérer les chevaux",
      ],
    })
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}