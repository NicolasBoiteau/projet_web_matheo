import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: `Mot de passe oublié — ${SITE_CONFIG.name}`,
  description: "Recevez un lien pour réinitialiser le mot de passe de votre compte.",
}

export default function MotDePasseOublieLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
