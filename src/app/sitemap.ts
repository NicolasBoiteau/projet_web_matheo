import type { MetadataRoute } from "next"
import { SITE_CONFIG } from "@/lib/utils/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/pensions`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/cavalerie`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/chevaux-a-vendre`, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/equipe`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/stages`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/contact`, priority: 0.6, changeFrequency: "monthly" as const },
  ]

  return staticPages.map((page) => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}