/**
 * Configuration du CMS générique : associe un "type" d'URL à une table
 * Supabase et à la liste blanche des champs modifiables. Utilisé par les
 * routes /api/cms/[type] et /api/cms/[type]/[id]. Module pur (pas de next/headers).
 */
export type CmsType =
  | "pensions"
  | "equipe"
  | "stages"
  | "services"
  | "stats"
  | "temoignages"

export const CMS_TABLES: Record<CmsType, { table: string; fields: string[] }> = {
  pensions: {
    table: "pension_packs",
    fields: ["slug", "name", "description", "price_cents", "features", "is_featured", "is_available", "sort_order"],
  },
  equipe: {
    table: "team_members",
    fields: ["name", "role", "bio", "specialties", "diplomas", "email", "phone", "portrait_url", "is_published", "sort_order"],
  },
  stages: {
    table: "events",
    fields: ["title", "description", "date_label", "time_label", "instructor", "level", "places", "price_cents", "location", "is_featured", "is_published", "sort_order"],
  },
  services: {
    table: "home_services",
    fields: ["icon", "title", "description", "sort_order"],
  },
  stats: {
    table: "home_stats",
    fields: ["value", "suffix", "label", "sort_order"],
  },
  temoignages: {
    table: "testimonials",
    fields: ["author", "context", "content", "rating", "is_published", "sort_order"],
  },
}

export function isCmsType(value: string): value is CmsType {
  return value in CMS_TABLES
}

// ---- Métadonnées UI (formulaires + tableaux admin) ----

export type CmsFieldType = "text" | "textarea" | "number" | "price" | "boolean" | "tags" | "select"

export type CmsField = {
  name: string
  label: string
  type: CmsFieldType
  options?: { value: string; label: string }[]
  help?: string
}

export type CmsMeta = {
  singular: string
  plural: string
  titleKey: string
  fields: CmsField[]
  columns: { key: string; label: string }[]
}

const ICON_OPTIONS = [
  "Building2", "Award", "GraduationCap", "Truck", "ClipboardCheck", "Rabbit",
  "Star", "Heart", "Shield", "Home", "Trophy", "Users", "Sparkles", "Medal",
].map((v) => ({ value: v, label: v }))

export const CMS_META: Record<CmsType, CmsMeta> = {
  pensions: {
    singular: "Pension", plural: "Pensions", titleKey: "name",
    columns: [{ key: "name", label: "Nom" }, { key: "is_featured", label: "Mis en avant" }],
    fields: [
      { name: "name", label: "Nom", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "price_cents", label: "Prix mensuel (€)", type: "price" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "features", label: "Caractéristiques (une par ligne)", type: "tags" },
      { name: "is_featured", label: "Mis en avant", type: "boolean" },
      { name: "is_available", label: "Disponible", type: "boolean" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
  },
  equipe: {
    singular: "Membre", plural: "Équipe", titleKey: "name",
    columns: [{ key: "name", label: "Nom" }, { key: "role", label: "Rôle" }, { key: "is_published", label: "Publié" }],
    fields: [
      { name: "name", label: "Nom", type: "text" },
      { name: "role", label: "Rôle", type: "text" },
      { name: "bio", label: "Biographie", type: "textarea" },
      { name: "specialties", label: "Spécialités (une par ligne)", type: "tags" },
      { name: "diplomas", label: "Diplômes (un par ligne)", type: "tags" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Téléphone", type: "text" },
      { name: "portrait_url", label: "URL du portrait", type: "text" },
      { name: "is_published", label: "Publié", type: "boolean" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
  },
  stages: {
    singular: "Stage", plural: "Stages", titleKey: "title",
    columns: [{ key: "title", label: "Titre" }, { key: "date_label", label: "Dates" }, { key: "is_published", label: "Publié" }],
    fields: [
      { name: "title", label: "Titre", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "date_label", label: "Dates (texte)", type: "text", help: "Ex. : 15-16 Juin 2026" },
      { name: "time_label", label: "Horaires (texte)", type: "text", help: "Ex. : 9h00 - 17h00" },
      { name: "instructor", label: "Intervenant", type: "text" },
      { name: "level", label: "Niveau", type: "text" },
      { name: "places", label: "Places", type: "number" },
      { name: "price_cents", label: "Tarif (€)", type: "price" },
      { name: "location", label: "Lieu", type: "text" },
      { name: "is_featured", label: "Recommandé", type: "boolean" },
      { name: "is_published", label: "Publié", type: "boolean" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
  },
  services: {
    singular: "Service", plural: "Services (accueil)", titleKey: "title",
    columns: [{ key: "title", label: "Titre" }],
    fields: [
      { name: "icon", label: "Icône", type: "select", options: ICON_OPTIONS },
      { name: "title", label: "Titre", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
  },
  stats: {
    singular: "Statistique", plural: "Statistiques (accueil)", titleKey: "label",
    columns: [{ key: "label", label: "Libellé" }, { key: "value", label: "Valeur" }],
    fields: [
      { name: "value", label: "Valeur", type: "number" },
      { name: "suffix", label: "Suffixe", type: "text", help: "Ex. : + ou  ha" },
      { name: "label", label: "Libellé", type: "text" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
  },
  temoignages: {
    singular: "Témoignage", plural: "Témoignages (accueil)", titleKey: "author",
    columns: [{ key: "author", label: "Auteur" }, { key: "is_published", label: "Publié" }],
    fields: [
      { name: "author", label: "Auteur", type: "text" },
      { name: "context", label: "Contexte", type: "text", help: "Ex. : Propriétaire de Uranus" },
      { name: "content", label: "Témoignage", type: "textarea" },
      { name: "rating", label: "Note (1-5)", type: "number" },
      { name: "is_published", label: "Publié", type: "boolean" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
  },
}

/** Ne conserve du corps que les champs autorisés pour ce type. */
export function pickFields(type: CmsType, body: Record<string, unknown>) {
  const allowed = CMS_TABLES[type].fields
  const out: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) out[key] = body[key]
  }
  return out
}
