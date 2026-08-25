"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { List, Map as MapIcon, Sparkles } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { usePlaces } from "@/hooks/usePlaces";
import { SearchBar } from "@/features/home/SearchBar";
import { EMPTY_FILTERS, FiltersSidebar, type AdvancedFilters } from "./FiltersSidebar";

const MapView = dynamic(() => import("@/features/home/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
  ),
});

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
  const [view, setView] = useState<"list" | "map">("list");

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
  // ponytail: destacados = lo que trae la página actual (limit: 30), no una
  // consulta aparte — si el catálogo crece y un destacado queda fuera de esa
  // página, no aparecerá. Subir a un query param `featured=true` si eso pasa.
  const featuredPlaces = places.filter((place) => place.isFeatured);
  const regularPlaces = places.filter((place) => !place.isFeatured);

  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur lg:top-16 dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3">
          <Logo className="lg:hidden" />
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 p-4 lg:flex-row">
        <FiltersSidebar
          category={category}
          onCategoryChange={setCategory}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">
              {!isLoading && !isError &&
                `${data?.total ?? places.length} resultado${(data?.total ?? places.length) === 1 ? "" : "s"} relacionado${(data?.total ?? places.length) === 1 ? "" : "s"}`}
            </p>
            <div className="flex shrink-0 gap-1 rounded-xl border border-neutral-200 p-1 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  view === "list"
                    ? "bg-primary text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                <List size={14} /> Mostrar lista
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  view === "map"
                    ? "bg-primary text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                <MapIcon size={14} /> Mostrar mapa
              </button>
            </div>
          </div>

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

          {!isLoading && !isError && places.length > 0 && view === "map" && (
            <div className="h-[70vh] overflow-hidden rounded-2xl">
              <MapView places={places} />
            </div>
          )}

          {!isLoading && !isError && places.length > 0 && view === "list" && (
            <>
              {featuredPlaces.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    <Sparkles size={16} className="text-primary" /> Anuncios destacados
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {featuredPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        onShowOnMap={() => setView("map")}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {regularPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onShowOnMap={() => setView("map")}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
