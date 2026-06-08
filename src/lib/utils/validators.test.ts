import { describe, it, expect } from "vitest"
import { registerSchema, bookingSchema, contactFormSchema } from "@/lib/utils/validators"

describe("registerSchema", () => {
  const base = {
    firstName: "Marie",
    lastName: "Durand",
    email: "marie@example.com",
    password: "motdepasse1",
    confirmPassword: "motdepasse1",
    acceptTerms: true as const,
  }

  it("valide un formulaire correct", () => {
    expect(registerSchema.safeParse(base).success).toBe(true)
  })

  it("rejette des mots de passe qui ne correspondent pas", () => {
    const res = registerSchema.safeParse({ ...base, confirmPassword: "autre" })
    expect(res.success).toBe(false)
  })

  it("rejette un mot de passe trop court (<8)", () => {
    const res = registerSchema.safeParse({ ...base, password: "court", confirmPassword: "court" })
    expect(res.success).toBe(false)
  })

  it("exige l'acceptation des conditions", () => {
    const res = registerSchema.safeParse({ ...base, acceptTerms: false })
    expect(res.success).toBe(false)
  })
})

describe("bookingSchema", () => {
  const slotId = "11111111-1111-4111-8111-111111111111"

  it("accepte une réservation valide", () => {
    const res = bookingSchema.safeParse({ slotId, type: "lesson", participants: 2 })
    expect(res.success).toBe(true)
  })

  it("rejette participants hors bornes (max 10)", () => {
    expect(bookingSchema.safeParse({ slotId, type: "lesson", participants: 11 }).success).toBe(false)
    expect(bookingSchema.safeParse({ slotId, type: "lesson", participants: 0 }).success).toBe(false)
  })

  it("rejette un type d'activité inconnu", () => {
    expect(bookingSchema.safeParse({ slotId, type: "concert", participants: 1 }).success).toBe(false)
  })

  it("rejette un slotId non-uuid", () => {
    expect(bookingSchema.safeParse({ slotId: "abc", type: "lesson", participants: 1 }).success).toBe(false)
  })
})

describe("contactFormSchema", () => {
  it("rejette un email invalide et un message trop court", () => {
    const res = contactFormSchema.safeParse({
      firstName: "Jo",
      lastName: "Li",
      email: "pas-un-email",
      subject: "Bonjour",
      message: "court",
    })
    expect(res.success).toBe(false)
  })
})
