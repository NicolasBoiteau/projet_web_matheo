"use client"

import dynamic from "next/dynamic"

type CalendarEvent = {
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
}

// FullCalendar chargé dynamiquement (pas de SSR) pour alléger le bundle.
const BookingCalendar = dynamic(
  () => import("@/components/booking/BookingCalendar").then((m) => ({ default: m.BookingCalendar })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center">
        <div className="skeleton h-full w-full rounded-xl" />
      </div>
    ),
  }
)

export function MemberPlanning({ events }: { events: CalendarEvent[] }) {
  return <BookingCalendar events={events} />
}
