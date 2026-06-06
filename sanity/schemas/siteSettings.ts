export const siteSettings = {
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  fields: [
    { name: "logo", title: "Logo", type: "image" },
    { name: "favicon", title: "Favicon", type: "image" },
    { name: "address", title: "Adresse", type: "string" },
    { name: "phone", title: "Téléphone", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "socialLinks", title: "Réseaux sociaux", type: "array", of: [
      { type: "object", fields: [
        { name: "platform", title: "Plateforme", type: "string" },
        { name: "url", title: "URL", type: "url" },
      ] },
    ]},
    { name: "googleMapsEmbedUrl", title: "URL Google Maps", type: "url" },
  ],
}