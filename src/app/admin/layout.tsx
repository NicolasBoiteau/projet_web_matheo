import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/horses"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sans backend configuré (placeholders en dev), on ne tente pas d'auth.
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
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/membre/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream/30 lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
