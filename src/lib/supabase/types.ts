export type Horse = {
  id: string
  name: string
  slug: string
  breed: string | null
  gender: "male" | "female" | "gelding" | null
  birth_year: number | null
  height_cm: number | null
  color: string | null
  disciplines: string[]
  description: string | null
  main_image_url: string | null
  gallery_urls: string[]
  pedigree: string | null
  competition_level: string | null
  is_for_sale: boolean
  sale_price_cents: number | null
  featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export type HorseFormData = {
  name: string
  slug: string
  breed?: string
  gender?: "male" | "female" | "gelding"
  birth_year?: number
  height_cm?: number
  color?: string
  disciplines?: string[]
  description?: string
  main_image_url?: string
  gallery_urls?: string[]
  pedigree?: string
  competition_level?: string
  is_for_sale?: boolean
  sale_price_cents?: number
  featured?: boolean
  is_published?: boolean
}

export type SlotType = "lesson" | "clinic" | "arena_rental"

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"

export type BookingSlot = {
  id: string
  slot_type: SlotType
  title: string
  description: string | null
  instructor_id: string | null
  start_time: string
  end_time: string
  max_participants: number
  price_cents: number
  currency: string
  is_recurring: boolean
  recurring_rule: string | null
  is_available: boolean
  created_at: string
}

/** Créneau enrichi du nombre de places restantes. */
export type SlotWithRemaining = BookingSlot & { remaining: number }

export type Reservation = {
  id: string
  user_id: string
  slot_id: string
  status: ReservationStatus
  participants: number
  notes: string | null
  amount_cents: number
  currency: string
  paid_at: string | null
  cancelled_at: string | null
  reminder_sent_at: string | null
  created_at: string
  updated_at: string
}

/** Réservation jointe à son créneau. */
export type ReservationWithSlot = Reservation & {
  booking_slots: BookingSlot | null
}

/** Réservation enrichie côté admin (créneau + profil membre). */
export type ReservationWithDetails = Reservation & {
  booking_slots: BookingSlot | null
  profiles: Pick<Profile, "first_name" | "last_name" | "email"> | null
}

export type PensionPack = {
  id: string
  slug: string
  name: string
  description: string | null
  price_cents: number
  features: string[]
  is_featured: boolean
  is_available: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type TeamMember = {
  id: string
  name: string
  role: string | null
  bio: string | null
  specialties: string[]
  diplomas: string[]
  email: string | null
  phone: string | null
  portrait_url: string | null
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type EventItem = {
  id: string
  title: string
  description: string | null
  date_label: string | null
  time_label: string | null
  instructor: string | null
  level: string | null
  places: number | null
  price_cents: number
  location: string | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type HomeService = {
  id: string
  icon: string | null
  title: string
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type HomeStat = {
  id: string
  value: number
  suffix: string
  label: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type Testimonial = {
  id: string
  author: string
  context: string | null
  content: string
  rating: number
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  avatar_url: string | null
  role: "admin" | "member" | "instructor"
  created_at: string
  updated_at: string
}