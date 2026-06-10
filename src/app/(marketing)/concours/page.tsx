import { ConcoursView } from "@/components/marketing/ConcoursView"
import { getPublishedConcours } from "@/lib/concours.server"

export const metadata = {
  title: "Concours & Palmarès",
  description:
    "Les prochains concours des Écuries du O'TAKEY et le palmarès de nos cavaliers.",
}

export default async function ConcoursPage() {
  const concours = await getPublishedConcours()
  return <ConcoursView concours={concours} />
}
