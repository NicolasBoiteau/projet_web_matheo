"use client"

import { useSyncExternalStore } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const DEFAULT_ALERT = {
  message: "Bienvenue aux Écuries du O'TAKEY — Prochains stages disponible !",
  dismissible: true,
}

// Petit « store » externe autour de localStorage : permet de lire l'état de
// fermeture pendant le rendu (via useSyncExternalStore) sans décalage
// d'hydratation et sans setState dans un effet.
const STORAGE_KEY = "alert-dismissed"
const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) === "true"
}

function getServerSnapshot() {
  // Côté serveur, on suppose la bannière visible (rien de stocké).
  return false
}

function dismiss() {
  localStorage.setItem(STORAGE_KEY, "true")
  listeners.forEach((l) => l())
}

export function AlertBanner() {
  const isDismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative bg-fir text-white"
        >
          <div className="relative mx-auto flex max-w-7xl items-center justify-center px-12 py-2.5 text-center text-sm font-medium">
            <span>{DEFAULT_ALERT.message}</span>
            {DEFAULT_ALERT.dismissible && (
              <button
                onClick={dismiss}
                className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-white/10"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
