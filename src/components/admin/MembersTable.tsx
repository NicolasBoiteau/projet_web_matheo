"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { avatarUrl } from "@/lib/avatar"
import type { Profile } from "@/lib/supabase/types"

const ROLE_OPTIONS: { value: Profile["role"]; label: string }[] = [
  { value: "member", label: "Membre" },
  { value: "instructor", label: "Moniteur" },
  { value: "admin", label: "Administrateur" },
]

export function MembersTable({
  members,
  currentUserId,
}: {
  members: Profile[]
  currentUserId: string | null
}) {
  const router = useRouter()
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRoleChange = async (member: Profile, role: Profile["role"]) => {
    setSavingId(member.id)
    setError(null)
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || "Échec de la mise à jour")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la mise à jour")
    } finally {
      setSavingId(null)
    }
  }

  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-fir/20 p-12 text-center text-gray-500">
        Aucun membre pour l’instant.
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-fir/10 bg-white">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="border-b border-fir/10 bg-fir/5 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Membre</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fir/5">
            {members.map((member) => {
              const fullName = `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim()
              const isSelf = member.id === currentUserId
              return (
                <tr key={member.id} className="hover:bg-fir/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarUrl(member.email || member.id)}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-full border border-fir/10 bg-cream"
                      />
                      <span className="font-medium text-fir">
                        {fullName || "—"}
                        {isSelf && <span className="ml-2 text-xs text-gray-400">(vous)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{member.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        disabled={isSelf || savingId === member.id}
                        onChange={(e) =>
                          handleRoleChange(member, e.target.value as Profile["role"])
                        }
                        className="rounded-lg border border-fir/10 bg-white px-3 py-1.5 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {savingId === member.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-gold" />
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
