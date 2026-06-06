import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-8xl font-bold text-gold">404</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-fir">Page non trouvée</h1>
      <p className="mt-2 text-gray-600">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="primary">Retour à l&apos;accueil</Button>
      </Link>
    </div>
  )
}