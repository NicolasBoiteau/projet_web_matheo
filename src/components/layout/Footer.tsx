"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Phone, MapPin, Globe } from "lucide-react"
import { SITE_CONFIG } from "@/lib/utils/constants"

export function Footer() {
  const pathname = usePathname()

  // Le back-office a son propre shell : pas de footer marketing.
  if (pathname.startsWith("/admin")) return null

  return (
    <footer className="bg-fir-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-xl font-bold text-gold">
              {SITE_CONFIG.name}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {SITE_CONFIG.tagline}. Centre équestre haut de gamme à Avrainville.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-gold hover:text-black"
                aria-label="Facebook"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-gold hover:text-black"
                aria-label="Instagram"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                { href: "/pensions", label: "Pensions" },
                { href: "/cavalerie", label: "Cavalerie" },
                { href: "/chevaux-a-vendre", label: "Chevaux à vendre" },
                { href: "/equipe", label: "L'équipe" },
                { href: "/stages", label: "Stages & événements" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                { href: "/reservation", label: "Réservation en ligne" },
                { href: "/contact", label: "Contact" },
                { href: "/login", label: "Espace membre" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  {SITE_CONFIG.address.street}
                  <br />
                  {SITE_CONFIG.address.postalCode} {SITE_CONFIG.address.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-gold">
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-gold"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
            <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/60">
              <p className="font-medium text-white/80">Horaires</p>
              <p>Lun-Ven : {SITE_CONFIG.hours.weekdays}</p>
              <p>Sam-Dim : {SITE_CONFIG.hours.weekend}</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}