import { EquipeView } from "@/components/marketing/EquipeView"
import { getTeamMembers } from "@/lib/content.server"

export const metadata = { title: "Notre Équipe" }

export default async function EquipePage() {
  const members = await getTeamMembers()
  return <EquipeView members={members} />
}
