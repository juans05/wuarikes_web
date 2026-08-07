"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/common/Logo";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { usePlaces } from "@/hooks/usePlaces";
import { SearchBar } from "@/features/home/SearchBar";
import { CategoryChips } from "@/features/home/CategoryChips";
import { EMPTY_FILTERS, FiltersPanel, type AdvancedFilters } from "@/features/home/FiltersPanel";

export function RestaurantesView({
  initialSearch,
  initialCategory,
}: {
  initialSearch: string;
  initialCategory: string | null;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [filters, setFilters] = useState<AdvancedFilters>(EMPTY_FILTERS);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = usePlaces({
    search: debouncedSearch || undefined,
    category: category ?? undefined,
    amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    minRating: filters.minRating,
    openNow: filters.openNow || undefined,
    limit: 30,
  });

  const places = data?.data ?? [];

  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur lg:top-16 dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3">
          <Logo className="lg:hidden" />
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2">
          <div className="min-w-0 flex-1">
            <CategoryChips active={category} onSelect={setCategory} />
          </div>
          <FiltersPanel filters={filters} onChange={setFilters} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 p-4">
        {isLoading && (
          <p className="py-8 text-center text-sm text-neutral-500">
            Cargando restaurantes...
          </p>
        )}
        {isError && (
          <p className="py-8 text-center text-sm text-red-500">
            No se pudo conectar con el backend. Verifica que huarique_backend
            esté corriendo.
          </p>
        )}
        {!isLoading && !isError && places.length === 0 && (
          <p className="py-8 text-center text-sm text-neutral-500">
            No encontramos restaurantes con esos filtros.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </main>
    </div>
  );
}
