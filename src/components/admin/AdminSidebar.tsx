"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Container, CalendarDays, ClipboardList, Trophy, FileText, Users, LogOut, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { createClient } from "@/lib/supabase/client"

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/chevaux", label: "Chevaux", icon: Container, exact: false },
  { href: "/admin/creneaux", label: "Créneaux", icon: CalendarDays, exact: false },
  { href: "/admin/reservations", label: "Réservations", icon: ClipboardList, exact: false },
  { href: "/admin/concours", label: "Concours", icon: Trophy, exact: false },
  { href: "/admin/membres", label: "Membres", icon: Users, exact: false },
  { href: "/admin/contenu", label: "Contenu", icon: FileText, exact: false },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-fir/10 bg-white lg:w-64 lg:border-b-0 lg:border-r">
      {/* En-tête : logo + raccourcis mobile */}
      <div className="flex items-center justify-between gap-2 border-b border-fir/10 px-4 py-4 lg:px-6 lg:py-5">
        <Link href="/admin" className="font-display text-lg font-bold text-fir lg:text-xl">
          Arantino <span className="text-gold">Admin</span>
        </Link>
        <div className="flex items-center gap-1 lg:hidden">
          <Link
            href="/"
            target="_blank"
            aria-label="Voir le site"
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-fir/5 hover:text-fir"
          >
            <ExternalLink className="h-5 w-5" />
          </Link>
          <button
            onClick={handleLogout}
            aria-label="Déconnexion"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation : onglets scrollables en mobile, colonne en desktop */}
      <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-1 lg:flex-col lg:space-y-1 lg:overflow-visible lg:p-4">
        {LINKS.map((link) => {
          const Icon = link.icon
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors lg:gap-3 lg:px-4 lg:py-3",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-gray-600 hover:bg-fir/5 hover:text-fir"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="whitespace-nowrap">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Pied de page : visible uniquement en desktop (mobile = raccourcis en-tête) */}
      <div className="hidden space-y-1 border-t border-fir/10 p-4 lg:block">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-fir/5 hover:text-fir"
        >
          <ExternalLink className="h-5 w-5" />
          Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
