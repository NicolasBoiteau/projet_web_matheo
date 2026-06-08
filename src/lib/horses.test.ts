import { describe, it, expect } from "vitest"
import { toHorseCard, frenchGender } from "@/lib/horses"
import type { Horse } from "@/lib/supabase/types"

describe("frenchGender", () => {
  it("traduit chaque sexe", () => {
    expect(frenchGender("male")).toBe("Mâle")
    expect(frenchGender("female")).toBe("Femelle")
    expect(frenchGender("gelding")).toBe("Hongre")
  })

  it("retourne un tiret pour une valeur inconnue", () => {
    expect(frenchGender(undefined as unknown as Horse["gender"])).toBe("—")
  })
})

describe("toHorseCard", () => {
  const horse = {
    id: "h1",
    name: "Tempête",
    slug: "tempete",
    breed: "Selle Français",
    birth_year: 2015,
    height_cm: 165,
    color: "Bai",
    disciplines: ["dressage"],
    main_image_url: "https://img/x.jpg",
    is_for_sale: true,
    sale_price_cents: 850000,
    gender: "female",
  } as unknown as Horse

  it("mappe les champs Supabase vers le format carte", () => {
    const card = toHorseCard(horse)
    expect(card._id).toBe("h1")
    expect(card.slug).toEqual({ current: "tempete" })
    expect(card.isForSale).toBe(true)
    expect(card.salePrice).toBe(8500) // cents -> euros
  })

  it("laisse salePrice indéfini quand le prix est null", () => {
    const card = toHorseCard({ ...horse, sale_price_cents: null } as unknown as Horse)
    expect(card.salePrice).toBeUndefined()
  })
})
