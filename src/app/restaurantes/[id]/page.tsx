import type { Metadata } from "next";
import { RestaurantView } from "@/features/restaurant/RestaurantView";
import { getPlace } from "@/services/places.service";

async function fetchPlace(id: string) {
  try {
    return await getPlace(id);
  } catch {
    return null;
  }
}

// JSON.stringify no escapa "</script>" — si el nombre/descripción de un
// negocio llegara a contenerlo, cerraría el <script> antes de tiempo.
function toSafeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export async function generateMetadata({
  params,
}: PageProps<"/restaurantes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const place = await fetchPlace(id);

  if (!place) {
    return { title: "Restaurante no encontrado" };
  }

  const title = `${place.name}${place.district?.name ? ` — ${place.district.name}` : ""}`;
  const description =
    place.description ??
    `${place.name}: reseñas, carta digital, horario y ubicación en Wuarikes.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: place.coverImageUrl ? [{ url: place.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: place.coverImageUrl ? [place.coverImageUrl] : undefined,
    },
  };
}

export default async function RestaurantPage({
  params,
}: PageProps<"/restaurantes/[id]">) {
  const { id } = await params;
  const place = await fetchPlace(id);

  return (
    <>
      {place && (
        <script
          type="application/ld+json"
          // Contenido generado por nosotros a partir de datos ya sanitizados
          // por el backend (nombre, dirección, rating) — no hay input de usuario aquí.
          dangerouslySetInnerHTML={{
            __html: toSafeJsonLd({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: place.name,
              description: place.description ?? undefined,
              image: place.coverImageUrl ?? undefined,
              telephone: place.phone ?? undefined,
              url: place.website ?? undefined,
              servesCuisine: place.category?.name ?? undefined,
              address: place.address
                ? { "@type": "PostalAddress", streetAddress: place.address }
                : undefined,
              geo: {
                "@type": "GeoCoordinates",
                latitude: place.latitude,
                longitude: place.longitude,
              },
              aggregateRating:
                place.totalReviews > 0
                  ? {
                      "@type": "AggregateRating",
                      ratingValue: place.rating,
                      reviewCount: place.totalReviews,
                    }
                  : undefined,
            }),
          }}
        />
      )}
      <RestaurantView id={id} />
    </>
  );
}
