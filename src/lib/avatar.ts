/**
 * Avatars de profil via DiceBear (style « glyphs »), déterministes et gratuits.
 * Voir https://www.dicebear.com/styles/glyphs/
 *
 * Le rendu dépend uniquement du `seed` : même graine ⇒ même avatar. On n'a donc
 * rien à stocker, l'avatar est dérivé de l'email (ou de l'id) de l'utilisateur.
 *
 * NB : seule la version 10.x de l'API HTTP sert le style « glyphs ».
 */
const DICEBEAR_BASE = "https://api.dicebear.com/10.x/glyphs/svg"

export function avatarUrl(seed: string | null | undefined): string {
  const cleaned = (seed || "otakey").trim().toLowerCase()
  return `${DICEBEAR_BASE}?seed=${encodeURIComponent(cleaned)}`
}
