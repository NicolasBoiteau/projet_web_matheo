import { z } from "zod"

export const contactFormSchema = z.object({
  firstName: z.string().min(2, "Prénom requis (2 caractères minimum)"),
  lastName: z.string().min(2, "Nom requis (2 caractères minimum)"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Sujet requis"),
  message: z.string().min(10, "Message trop court (10 caractères minimum)"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().optional(),
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { message: "Vous devez accepter les conditions" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const bookingSchema = z.object({
  slotId: z.string().uuid("Créneau invalide"),
  type: z.enum(["lesson", "clinic", "arena_rental"]),
  participants: z.number().min(1).max(10),
  notes: z.string().max(500).optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>