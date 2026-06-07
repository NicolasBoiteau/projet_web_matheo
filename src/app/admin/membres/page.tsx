import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/horses"
import { MembersTable } from "@/components/admin/MembersTable"
import type { Profile } from "@/lib/supabase/types"

export default async function AdminMembresPage() {
  let members: Profile[] = []
  let currentUserId: string | null = null

  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    currentUserId = user?.id ?? null

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
    members = (data as Profile[]) ?? []
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fir">Membres</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez les comptes et leurs rôles. Un <strong>moniteur</strong> peut créer et gérer des cours.
        </p>
      </div>

      <MembersTable members={members} currentUserId={currentUserId} />
    </div>
  )
}
