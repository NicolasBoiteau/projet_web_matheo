import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { HorsesTable } from "@/components/admin/HorsesTable"
import type { Horse } from "@/lib/supabase/types"

export default async function AdminChevauxPage() {
  const supabase = await createClient()
  const { data: horses } = await supabase
    .from("horses")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-fir">Chevaux</h1>
        <Link
          href="/admin/chevaux/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
        >
          <Plus className="h-4 w-4" />
          Ajouter un cheval
        </Link>
      </div>

      <HorsesTable horses={(horses as Horse[]) ?? []} />
    </div>
  )
}
