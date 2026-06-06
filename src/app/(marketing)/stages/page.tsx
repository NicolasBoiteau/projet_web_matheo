import { StagesView } from "@/components/marketing/StagesView"
import { getEvents } from "@/lib/content.server"

export const metadata = { title: "Stages & Événements" }

export default async function StagesPage() {
  const events = await getEvents()
  return <StagesView events={events} />
}
