import { createClient, type QueryParams } from "next-sanity"

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "votre_id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN,
})

export async function getSanityData<T>(query: string, params?: QueryParams): Promise<T> {
  return client.fetch<T>(query, params ?? {}, {
    next: { revalidate: 300 },
  })
}