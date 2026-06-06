export const SITE_CONFIG = {
  name: "Les Écuries du O'TAKEY",
  tagline: "Dynamisme, Excellence, Passion",
  description:
    "Centre équestre haut de gamme à Avrainville. Pensions sur-mesure, coaching personnalisé, stages et valorisation de chevaux.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "contact@ecuries-otakey.fr",
  phone: "+33 X XX XX XX XX",
  address: {
    street: "Route d'Avrainville",
    city: "Avrainville",
    postalCode: "91630",
    country: "France",
  },
  social: {
    facebook: "https://facebook.com/ecuriesotakey",
    instagram: "https://instagram.com/ecuriesotakey",
  },
  hours: {
    weekdays: "8h00 - 19h00",
    weekend: "9h00 - 17h00",
  },
} as const

export const BRAND_COLORS = {
  black: "#000000",
  gold: "#C5A55A",
  copper: "#B87333",
  firGreen: "#1B3A2D",
  firGreenLight: "#2D5A47",
} as const

export const PENSION_PACKS = [
  {
    id: "box",
    name: "Box Premium",
    price: 650,
    featured: false,
    features: [
      "Box grande taille (4x4m)",
      "Paille ou copeaux au choix",
      "2 repas par jour sur-mesure",
      "Mise au paddock quotidienne",
      "Paillage quotidien",
      "Accès carrière et manège",
    ],
  },
  {
    id: "paddock",
    name: "Paddock Paradise",
    price: 450,
    featured: false,
    features: [
      "Paddock individuel ou collectif",
      "Abri et point d'eau automatique",
      "Distribution fourrage",
      "Accès carrière et manège",
      "Suivi nutritionnel de base",
      "Surveillance quotidienne",
    ],
  },
  {
    id: "complet",
    name: "Pack Compétition",
    price: 950,
    featured: true,
    features: [
      "Box Premium + Paddock",
      "Coaching personnalisé 2x/semaine",
      "Planning compétition sur-mesure",
      "Transport aux concours",
      "Ostéopathe et dentiste inclus",
      "Suivi vétérinaire prioritaire",
      "Accès illimité aux installations",
    ],
  },
] as const