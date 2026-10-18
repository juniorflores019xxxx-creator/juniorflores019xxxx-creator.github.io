import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/diagnostico/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/privacidad/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...SERVICES.map((s) => ({
      url: `${SITE.url}/servicios/${s.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
