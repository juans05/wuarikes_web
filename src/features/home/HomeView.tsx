"use client";

import { Logo } from "@/components/common/Logo";
import { PlaceCardSkeleton } from "@/components/common/Skeleton";
import { useCategories, usePlaces } from "@/hooks/usePlaces";
import type { Place } from "@/types/place";
import { CategoryRow } from "./CategoryRow";
import { CategoryTiles } from "./CategoryTiles";
import { HeroSection } from "./HeroSection";
import { HostCTASection } from "./HostCTASection";

export function HomeView() {
  const { data: categories } = useCategories();
  const { data, isLoading, isError } = usePlaces({ limit: 100 });

  const places = data?.data ?? [];
  const placesByCategory = new Map<string, Place[]>();
  for (const place of places) {
    if (!place.category) continue;
    const list = placesByCategory.get(place.category.slug) ?? [];
    list.push(place);
    placesByCategory.set(place.category.slug, list);
  }

  const categoriesWithPlaces = (categories ?? []).filter(
    (category) => (placesByCategory.get(category.slug)?.length ?? 0) > 0,
  );

  return (
    <div className="flex min-h-screen flex-col gap-14 pb-16 lg:pb-0">
      <div className="flex items-center px-4 py-3 lg:hidden">
        <Logo />
      </div>

      <HeroSection />

      {categoriesWithPlaces.length > 0 && (
        <section className="mx-auto w-full max-w-[1600px] px-4">
          <h2 className="mb-4 font-heading text-xl font-bold text-neutral-900 dark:text-neutral-50">
            Explora por categoría
          </h2>
          <CategoryTiles categories={categoriesWithPlaces} />
        </section>
      )}

      {isLoading && (
        <section className="mx-auto w-full max-w-[1600px] px-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        </section>
      )}

      {isError && (
        <section className="mx-auto w-full max-w-[1600px] px-4">
          <p className="py-8 text-center text-sm text-red-500">
            No se pudo conectar con el backend. Verifica que huarique_backend esté corriendo.
          </p>
        </section>
      )}

      {!isLoading &&
        !isError &&
        categoriesWithPlaces.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            places={(placesByCategory.get(category.slug) ?? []).slice(0, 8)}
          />
        ))}

      <HostCTASection />
    </div>
  );
}
