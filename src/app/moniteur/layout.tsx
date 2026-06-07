import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/horses"
import { MoniteurSidebar } from "@/components/moniteur/MoniteurSidebar"

export default async function MoniteurLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isSupabaseConfigured()) {
    redirect("/login")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name, last_name, email")
    .eq("id", user.id)
    .single()

  // Réservé aux moniteurs (et admins).
  if (profile?.role !== "instructor" && profile?.role !== "admin") {
    redirect("/membre/dashboard")
  }

  const fullName = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim()

  return (
    <div className="flex min-h-screen flex-col bg-cream/30 lg:flex-row">
      <MoniteurSidebar name={fullName} email={profile?.email ?? user.email ?? ""} />
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
