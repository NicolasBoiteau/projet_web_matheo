import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { HorseForm } from "@/components/admin/HorseForm"
import type { Horse } from "@/lib/supabase/types"

export default async function EditChevalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: horse } = await supabase.from("horses").select("*").eq("id", id).single()

  if (!horse) {
    notFound()
  }

  return (
    <div>
      <Link
        href="/admin/chevaux"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold text-fir">
        Modifier {(horse as Horse).name}
      </h1>
      <HorseForm initialData={horse as Horse} />
    </div>
  )
}
