import { Suspense } from "react"
import { HorseGrid } from "@/components/horses/HorseGrid"
import { PageHeader } from "@/components/shared/PageHeader"
import { toHorseCard } from "@/lib/horses"
import { getPublishedHorses } from "@/lib/horses.server"

export const metadata = {
  title: "Notre Cavalerie",
}

export default async function CavaleriePage() {
  const horses = (await getPublishedHorses()).map(toHorseCard)

  return (
    <div>
      <PageHeader
        title="Notre Cavalerie"
        subtitle="Découvrez nos chevaux, leur discipline et leur histoire. Filtrez par discipline, âge ou race pour trouver le profil qui vous intéresse."
      />

      <section className="relative -mt-8 pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Suspense>
            <HorseGrid horses={horses} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
