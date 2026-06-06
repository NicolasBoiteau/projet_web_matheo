import Link from "next/link"
import { FileText } from "lucide-react"
import { CMS_META, type CmsType } from "@/lib/cms"

export default function AdminContenuPage() {
  const types = Object.keys(CMS_META) as CmsType[]

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold text-fir">Contenu du site</h1>
      <p className="mb-8 text-sm text-gray-500">
        Gérez les textes et listes affichés sur le site public.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((type) => (
          <Link
            key={type}
            href={`/admin/contenu/${type}`}
            className="group rounded-2xl border border-fir/10 bg-white p-6 transition-colors hover:border-gold/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                <FileText className="h-5 w-5 text-gold" />
              </div>
              <span className="font-display text-lg font-bold text-fir group-hover:text-gold">
                {CMS_META[type].plural}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
