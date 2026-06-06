import { PensionsView } from "@/components/marketing/PensionsView"
import { getPensionPacks } from "@/lib/content.server"

export const metadata = { title: "Nos Pensions" }

export default async function PensionsPage() {
  const packs = await getPensionPacks()
  return <PensionsView packs={packs} />
}
