import type { MetadataRoute } from "next";
import { getPlaces } from "@/services/places.service";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/registro`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    // ponytail: una sola página de 100 lugares — el backend no tiene un
    // endpoint "todos los lugares" pensado para sitemaps. Si el catálogo
    // crece más allá de eso, paginar aquí o generar un sitemap index.
    const { data: places } = await getPlaces({ limit: 100 });
    const placeRoutes: MetadataRoute.Sitemap = places.map((place) => ({
      url: `${SITE_URL}/restaurantes/${place.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticRoutes, ...placeRoutes];
  } catch {
    return staticRoutes;
  }
}
