"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { motion, AnimatePresence } from "framer-motion"

const DEFAULT_ALERT = {
  message: "Bienvenue aux Écuries du O'TAKEY — Prochains stages disponible !",
  dismissible: true,
}

export function AlertBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem("alert-dismissed")
    if (dismissed === "true") setIsDismissed(true)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem("alert-dismissed", "true")
  }

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative bg-fir text-white"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2.5 text-center text-sm font-medium">
            <span>{DEFAULT_ALERT.message}</span>
            {DEFAULT_ALERT.dismissible && (
              <button
                onClick={handleDismiss}
                className="ml-4 inline-flex shrink-0 rounded-full p-1 transition-colors hover:bg-white/10"
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