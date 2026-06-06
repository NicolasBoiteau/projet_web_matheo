import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { CMS_META, isCmsType } from "@/lib/cms"
import { getCmsItem } from "@/lib/content.server"
import { CmsForm } from "@/components/admin/CmsForm"

export default async function CmsEditPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>
}) {
  const { type, id } = await params
  if (!isCmsType(type)) notFound()

  const item = await getCmsItem(type, id)
  if (!item) notFound()

  return (
    <div>
      <Link
        href={`/admin/contenu/${type}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold text-fir">
        Modifier — {CMS_META[type].singular}
      </h1>
      <CmsForm type={type} initialData={item} />
    </div>
  )
}
