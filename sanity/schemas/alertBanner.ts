export const alertBanner = {
  name: "alertBanner",
  title: "Bandeau d'alerte",
  type: "document",
  fields: [
    { name: "message", title: "Message", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "isActive", title: "Actif", type: "boolean", initialValue: false },
    { name: "backgroundColor", title: "Couleur de fond", type: "string" },
    { name: "textColor", title: "Couleur du texte", type: "string" },
    { name: "link", title: "Lien (optionnel)", type: "url" },
    { name: "dismissible", title: "Dissimulable", type: "boolean", initialValue: true },
    { name: "expiresAt", title: "Expire le", type: "datetime" },
  ],
}