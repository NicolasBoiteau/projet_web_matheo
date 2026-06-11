import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: `Inscription — ${SITE_CONFIG.name}`,
  description: "Créez votre compte pour accéder à l'espace membre des Écuries du O'TAKEY.",
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
