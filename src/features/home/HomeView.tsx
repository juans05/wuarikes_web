"use client";

import Link from "next/link";
import { PlaceCardSkeleton } from "@/components/common/Skeleton";
import { useCategories, useMostFavorited, usePlaces } from "@/hooks/usePlaces";
import { rubroQuery, useVerticalFilter } from "@/hooks/useVerticalFilter";
import type { Place } from "@/types/place";
import { CategoryRow } from "./CategoryRow";
import { HeroSection } from "./HeroSection";
import { HostCTASection } from "./HostCTASection";
import { PlaceRow } from "./PlaceRow";
import { VerticalChips } from "./VerticalChips";

// Inicio corto a propósito: buscar, elegir rubro/categoría y ver pocas filas.
const MAX_ROWS = 3;

export function HomeView({ initialRubro }: { initialRubro: string | null }) {
  const { vertical, setVertical } = useVerticalFilter(initialRubro);
  const { data: categories } = useCategories(vertical);
  const { data, isLoading, isError } = usePlaces({ limit: 100, vertical });
  const { data: mostFavorited } = useMostFavorited(vertical);

  const rubro = rubroQuery(vertical);
  const placesByCategory = new Map<string, Place[]>();
  for (const place of data?.data ?? []) {
    const slug = place.category?.slug;
    if (slug) placesByCategory.set(slug, [...(placesByCategory.get(slug) ?? []), place]);
  }

  const categoriesWithPlaces = (categories ?? []).filter((c) => placesByCategory.has(c.slug));
  const topCategories = [...categoriesWithPlaces]
    .sort((a, b) => placesByCategory.get(b.slug)!.length - placesByCategory.get(a.slug)!.length)
    .slice(0, MAX_ROWS);

  return (
    <div className="flex min-h-screen flex-col gap-14 pb-20 lg:pb-12">
      <HeroSection vertical={vertical} />

      <section className="mx-auto -mt-8 flex w-full max-w-[1400px] flex-col gap-3 px-4">
        <VerticalChips value={vertical} onChange={setVertical} />
        {categoriesWithPlaces.length > 0 && (
          <nav
            aria-label="Categorías"
            className="flex gap-x-5 gap-y-2 overflow-x-auto pb-1 text-sm [scrollbar-width:none]"
          >
            {categoriesWithPlaces.map((c) => (
              <Link
                key={c.id}
                href={`/restaurantes?categoria=${encodeURIComponent(c.slug)}${rubro}`}
                className="shrink-0 py-1 text-neutral-500 transition hover:text-primary dark:text-neutral-400"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        )}
      </section>

      <PlaceRow
        title="Los más guardados"
        subtitle="Favoritos de la comunidad Wuarikes"
        places={mostFavorited ?? []}
      />

      {isLoading && (
        <section className="mx-auto w-full max-w-[1400px] px-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        </section>
      )}

      {isError && (
        <section className="mx-auto w-full max-w-[1400px] px-4">
          <p className="py-8 text-center text-sm text-red-500">
            No se pudo conectar con el backend. Verifica que huarique_backend esté corriendo.
          </p>
        </section>
      )}

      {topCategories.map((category) => (
        <CategoryRow
          key={category.id}
          category={category}
          vertical={vertical}
          places={placesByCategory.get(category.slug)!.slice(0, 8)}
        />
      ))}

      <HostCTASection />
    </div>
  );
}
