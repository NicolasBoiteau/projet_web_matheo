"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { createClient } from "@/lib/supabase/client"

const SIDEBAR_LINKS = [
  { href: "/membre/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/membre/planning", label: "Mon planning", icon: Calendar },
  { href: "/membre/parametres", label: "Paramètres", icon: Settings },
]

export default function MembreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto flex max-w-7xl px-4 lg:px-8">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 py-8 lg:block">
          <nav className="space-y-1">
            {SIDEBAR_LINKS.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-gray-600 hover:bg-fir/5 hover:text-fir"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="flex w-full flex-col lg:ml-8">
          <nav className="flex overflow-x-auto border-b border-fir/10 lg:hidden">
            {SIDEBAR_LINKS.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 px-4 py-3 text-xs font-medium transition-colors",
                    isActive
                      ? "border-b-2 border-gold text-gold"
                      : "text-gray-500 hover:text-fir"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="py-6">{children}</div>
        </div>
      </div>
    </div>
  )
}