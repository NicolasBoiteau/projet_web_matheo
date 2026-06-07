import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip auth if Supabase is not configured (dev with placeholder env vars)
  if (!url || !anonKey || !url.startsWith("http")) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next()

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next()
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const protectedPaths = ["/membre", "/admin", "/moniteur"]
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  const authPaths = ["/login", "/register"]
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path))

  // Le rôle n'est nécessaire que pour les zones réservées et les pages d'auth.
  const needsRole =
    user && (pathname.startsWith("/admin") || pathname.startsWith("/moniteur") || isAuthPage)

  let role: string | null = null
  if (needsRole) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user!.id)
      .single()
    role = profile?.role ?? null
  }

  // Destination par défaut selon le rôle (back-office, espace moniteur, ou membre).
  const homeFor = (r: string | null) =>
    r === "admin" ? "/admin" : r === "instructor" ? "/moniteur" : "/membre/dashboard"

  // /admin réservé aux administrateurs.
  if (pathname.startsWith("/admin") && role !== "admin") {
    const url = request.nextUrl.clone()
    url.pathname = homeFor(role)
    return NextResponse.redirect(url)
  }

  // /moniteur réservé aux moniteurs (et admins).
  if (pathname.startsWith("/moniteur") && role !== "instructor" && role !== "admin") {
    const url = request.nextUrl.clone()
    url.pathname = homeFor(role)
    return NextResponse.redirect(url)
  }

  // Un utilisateur déjà connecté qui visite /login ou /register part vers son espace.
  if (isAuthPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = homeFor(role)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}