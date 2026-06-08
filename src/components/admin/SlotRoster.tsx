import { Users } from "lucide-react"
import { computeRemaining } from "@/lib/bookings"
import { STATUS_BADGE, STATUS_LABELS } from "@/lib/bookings"
import type { ReservationWithDetails } from "@/lib/supabase/types"

type Props = {
  reservations: ReservationWithDetails[]
  maxParticipants: number
}

/** Liste des inscrits d'un créneau (vue moniteur / admin). */
export function SlotRoster({ reservations, maxParticipants }: Props) {
  const remaining = computeRemaining(maxParticipants, reservations)
  const booked = maxParticipants - remaining

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-fir">
          <Users className="h-5 w-5 text-gold" /> Inscrits
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {booked} / {maxParticipants} place(s) · {remaining} restante(s)
        </span>
      </div>

      {reservations.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          Aucun inscrit pour le moment.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {reservations.map((r) => {
            const name =
              [r.profiles?.first_name, r.profiles?.last_name].filter(Boolean).join(" ") ||
              "Membre"
            return (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-fir">{name}</p>
                  {r.profiles?.email && (
                    <p className="truncate text-sm text-gray-400">{r.profiles.email}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {r.participants > 1 && (
                    <span className="text-sm text-gray-500">×{r.participants}</span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[r.status]}`}
                  >
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
