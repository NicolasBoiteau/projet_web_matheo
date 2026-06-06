import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/shared/EmptyState"
import { HorseDetail } from "@/components/horses/HorseDetail"
import { getHorseBySlug } from "@/lib/horses.server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const horse = await getHorseBySlug(slug)
  return { title: horse?.name ?? "Cheval" }
}

export default async function HorseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const horse = await getHorseBySlug(slug)

  if (!horse) {
    return (
      <div className="pt-32">
        <EmptyState
          title="Cheval non trouvé"
          description="Ce cheval n'existe pas ou a été retiré."
          action={
            <Link href="/cavalerie">
              <Button variant="primary">Retour à la cavalerie</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return <HorseDetail horse={horse} />
}
