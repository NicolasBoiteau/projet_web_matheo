import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, slug } = body

    // Revalide les chemins concernés (appelable après une édition de contenu).
    switch (type) {
      case "horse":
        revalidatePath("/cavalerie")
        if (slug) revalidatePath(`/cavalerie/${slug}`)
        break
      case "teamMember":
        revalidatePath("/equipe")
        break
      case "pensionPack":
        revalidatePath("/pensions")
        break
      case "clinic":
        revalidatePath("/stages")
        break
      default:
        revalidatePath("/")
    }

    return NextResponse.json({ revalidated: true })
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 })
  }
}