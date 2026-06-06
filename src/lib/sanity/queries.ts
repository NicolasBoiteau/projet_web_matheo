import { groq } from "next-sanity"

export const HORSES_QUERY = groq`*[_type == "horse" && defined(slug.current)] | order(name asc) {
  _id,
  name,
  slug,
  breed,
  gender,
  birthYear,
  heightCm,
  color,
  disciplines,
  "mainImage": mainImage.asset->url,
  isForSale,
  salePrice,
  featured
}`

export const HORSE_BY_SLUG_QUERY = groq`*[_type == "horse" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  breed,
  gender,
  birthYear,
  heightCm,
  color,
  disciplines,
  description,
  "mainImage": mainImage.asset->url,
  "gallery": gallery[].asset->url,
  pedigree,
  competitionLevel,
  isForSale,
  salePrice,
  featured,
  seo
}`

export const TEAM_QUERY = groq`*[_type == "teamMember" && defined(slug.current)] | order(orderRank asc) {
  _id,
  name,
  slug,
  role,
  "portrait": portrait.asset->url,
  bio,
  diplomas,
  specialties,
  email,
  phone
}`

export const PENSION_PACKS_QUERY = groq`*[_type == "pensionPack"] | order(monthlyPriceCents asc) {
  _id,
  name,
  description,
  monthlyPriceCents,
  features,
  highlighted,
  available
}`

export const ALERT_BANNER_QUERY = groq`*[_type == "alertBanner" && isActive == true && (!defined(expiresAt) || expiresAt > now())][0] {
  _id,
  message,
  backgroundColor,
  textColor,
  link,
  dismissible
}`