"use client"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import frLocale from "@fullcalendar/core/locales/fr"

type CalendarEvent = {
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
}

type BookingCalendarProps = {
  events?: CalendarEvent[]
  onDateSelect?: (date: Date) => void
  selectable?: boolean
}

export function BookingCalendar({ events = [], onDateSelect, selectable = false }: BookingCalendarProps) {
  return (
    <div className="booking-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        events={events}
        selectable={selectable}
        select={(info) => onDateSelect?.(info.start)}
        height="auto"
        dayMaxEvents={3}
        moreLinkText={(num) => `+${num} autres`}
        noEventsText="Aucun événement"
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
        }}
      />
    </div>
  )
}