import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: `Nouveau mot de passe — ${SITE_CONFIG.name}`,
  description: "Définissez un nouveau mot de passe pour votre compte.",
}

export default function ReinitialiserMotDePasseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
