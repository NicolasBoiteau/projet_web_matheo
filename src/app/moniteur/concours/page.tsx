import { ConcoursManager } from "@/components/concours/ConcoursManager"
import { getAllConcours } from "@/lib/concours.server"

export default async function MoniteurConcoursPage() {
  const concours = await getAllConcours()
  return <ConcoursManager concours={concours} />
}
