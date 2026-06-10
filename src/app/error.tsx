"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/Button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-8xl font-bold text-copper">!</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-fir">Une erreur est survenue</h1>
      <p className="mt-2 text-gray-600">
        Veuillez réessayer ou nous contacter si le problème persiste.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="primary" onClick={reset}>
          Réessayer
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Accueil
        </Button>
      </div>
    </div>
  )
}