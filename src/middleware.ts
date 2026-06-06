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

  const protectedPaths = ["/membre", "/admin"]
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // /admin réservé aux administrateurs
  if (request.nextUrl.pathname.startsWith("/admin") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/membre/dashboard"
      return NextResponse.redirect(url)
    }
  }

  const authPaths = ["/login", "/register"]
  const isAuthPage = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isAuthPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/membre/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}