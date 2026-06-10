"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { AlertBanner } from "@/components/layout/AlertBanner"
import { SITE_CONFIG } from "@/lib/utils/constants"

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/pensions", label: "Pensions" },
  { href: "/cavalerie", label: "Cavalerie" },
  { href: "/equipe", label: "L'équipe" },
  { href: "/stages", label: "Stages" },
  { href: "/concours", label: "Concours" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Les back-offices (admin + moniteur) ont leur propre shell : pas de navbar marketing.
  if (pathname.startsWith("/admin") || pathname.startsWith("/moniteur")) return null

  // Transparent uniquement en haut de l'accueil (au-dessus du hero photo).
  const transparent = pathname === "/" && !scrolled && !isOpen

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-md"
      )}
    >
      {/* Bandeau d'alerte empilé au-dessus de la nav (jamais en superposition). */}
      <AlertBanner />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span
            className={cn(
              "font-display text-base font-bold tracking-wide transition-colors sm:text-lg md:text-xl",
              transparent ? "text-white" : "text-fir"
            )}
          >
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-gold"
                    : transparent
                      ? "text-white/80 hover:text-white"
                      : "text-fir/70 hover:text-fir"
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/login"
            className={cn(
              "ml-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              transparent ? "text-white/80 hover:text-white" : "text-fir/70 hover:text-fir"
            )}
          >
            Espace membre
          </Link>
          <Link href="/reservation">
            <Button variant="primary" size="sm" className="ml-2">
              Réserver
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn("transition-colors lg:hidden", transparent ? "text-white" : "text-fir")}
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-black/5 bg-white lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                    pathname === link.href
                      ? "bg-gold/10 text-gold"
                      : "text-fir/70 hover:bg-fir/5 hover:text-fir"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/reservation" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Réserver
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Espace membre
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
