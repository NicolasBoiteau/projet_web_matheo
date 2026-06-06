export function formatPrice(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(cents / 100)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(d)
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function formatSlotType(type: string): string {
  const labels: Record<string, string> = {
    lesson: "Cours",
    clinic: "Stage",
    arena_rental: "Location carrière",
  }
  return labels[type] || type
}