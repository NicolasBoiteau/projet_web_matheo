export const teamMember = {
  name: "teamMember",
  title: "Membre de l'équipe",
  type: "document",
  fields: [
    { name: "name", title: "Nom", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 } },
    { name: "role", title: "Rôle", type: "string" },
    { name: "portrait", title: "Portrait", type: "image", options: { hotspot: true } },
    { name: "bio", title: "Biographie", type: "blockContent" },
    {
      name: "diplomas", title: "Diplômes", type: "array", of: [
        { type: "object", fields: [
          { name: "title", title: "Titre", type: "string" },
          { name: "year", title: "Année", type: "number" },
          { name: "institution", title: "Institution", type: "string" },
        ] },
      ],
    },
    { name: "specialties", title: "Spécialités", type: "array", of: [{ type: "string" }] },
    { name: "email", title: "Email", type: "string" },
    { name: "phone", title: "Téléphone", type: "string" },
    { name: "orderRank", title: "Ordre", type: "number" },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "portrait" },
  },
}