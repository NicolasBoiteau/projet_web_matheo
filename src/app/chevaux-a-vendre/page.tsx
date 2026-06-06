import { Suspense } from "react"
import { HorseGrid } from "@/components/horses/HorseGrid"
import { PageHeader } from "@/components/shared/PageHeader"
import { toHorseCard } from "@/lib/horses"
import { getHorsesForSale } from "@/lib/horses.server"

export const metadata = {
  title: "Chevaux à Vendre",
}

export default async function ChevauxAVendrePage() {
  const horses = (await getHorsesForSale()).map(toHorseCard)

  return (
    <div>
      <PageHeader
        title="Chevaux à Vendre"
        subtitle="Découvrez nos chevaux disponibles à la vente. Chaque cheval est valorisé et préparé avec soin par notre équipe."
      />

      <section className="relative -mt-8 pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Suspense>
            <HorseGrid horses={horses} forSale />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
