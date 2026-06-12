import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: `Connexion — ${SITE_CONFIG.name}`,
  description: "Connectez-vous à votre espace membre des Écuries Arantino.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
