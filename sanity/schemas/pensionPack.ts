export const pensionPack = {
  name: "pensionPack",
  title: "Pack Pension",
  type: "document",
  fields: [
    { name: "name", title: "Nom", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "description", title: "Description", type: "text" },
    { name: "monthlyPriceCents", title: "Prix mensuel (centimes)", type: "number", description: "Prix en centimes (ex: 65000 = 650€)" },
    {
      name: "features", title: "Caractéristiques", type: "array", of: [
        { type: "object", fields: [
          { name: "text", title: "Texte", type: "string" },
          { name: "included", title: "Inclus", type: "boolean", initialValue: true },
        ] },
      ],
    },
    { name: "highlighted", title: "Mis en avant", type: "boolean", initialValue: false },
    { name: "available", title: "Disponible", type: "boolean", initialValue: true },
  ],
  preview: {
    select: { title: "name" },
  },
}