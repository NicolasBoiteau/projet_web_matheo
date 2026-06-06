import Link from "next/link"
import { notFound } from "next/navigation"
import { Plus, ArrowLeft } from "lucide-react"
import { CMS_META, isCmsType } from "@/lib/cms"
import { ADMIN_FETCHERS } from "@/lib/content.server"
import { CmsTable } from "@/components/admin/CmsTable"

export default async function CmsListPage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  if (!isCmsType(type)) notFound()

  const items = await ADMIN_FETCHERS[type]()
  const meta = CMS_META[type]

  return (
    <div>
      <Link
        href="/admin/contenu"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Tout le contenu
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-fir">{meta.plural}</h1>
        <Link
          href={`/admin/contenu/${type}/nouveau`}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Link>
      </div>

      <CmsTable type={type} items={items} />
    </div>
  )
}
