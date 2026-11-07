"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { List, MapPin, Map as MapIcon, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { usePlaces } from "@/hooks/usePlaces";
import { useVerticalFilter } from "@/hooks/useVerticalFilter";
import { SearchBar } from "@/features/home/SearchBar";
import { VerticalChips } from "@/features/home/VerticalChips";
import { EMPTY_FILTERS, FiltersSidebar, type AdvancedFilters } from "./FiltersSidebar";
import { WuarikesHereForm } from "./WuarikesHereForm";

const MapView = dynamic(() => import("@/features/home/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
  ),
});

export function RestaurantesView({
  initialSearch,
  initialCategory,
  initialRubro,
  initialDistrict = null,
  initialFilters = EMPTY_FILTERS,
}: {
  initialSearch: string;
  initialCategory: string | null;
  initialRubro: string | null;
  initialDistrict?: string | null;
  initialFilters?: AdvancedFilters;
}) {
  const { vertical, setVertical } = useVerticalFilter(initialRubro);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [district, setDistrict] = useState<string | null>(initialDistrict);
  const [filters, setFilters] = useState<AdvancedFilters>(initialFilters);
  const [view, setView] = useState<"list" | "map">("list");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = usePlaces({
    vertical,
    search: debouncedSearch || undefined,
    category: category ?? undefined,
    district: district ?? undefined,
    amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    minRating: filters.minRating,
    openNow: filters.openNow || undefined,
    hasLoyalty: filters.hasLoyalty || undefined,
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
          vertical={vertical}
          onCategoryChange={setCategory}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <main className="min-w-0 flex-1">
          <VerticalChips
            value={vertical}
            className="mb-4"
            onChange={(next) => {
              setVertical(next);
              // Las categorías son de cada rubro: la elegida ya no aplica.
              setCategory(null);
            }}
          />

          {district && (
            <button
              type="button"
              onClick={() => setDistrict(null)}
              className="mb-4 flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100 dark:bg-neutral-800 dark:text-primary-300"
            >
              <MapPin size={14} /> {district} <X size={14} aria-label="Quitar distrito" />
            </button>
          )}

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
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="text-5xl">🤷‍♂️</span>
              <p className="font-heading text-lg font-bold text-neutral-900 dark:text-neutral-50">
                Uy, nada por aquí con ese plan
              </p>
              <p className="text-sm text-neutral-500">Prueba quitando algún filtro.</p>
              <button
                type="button"
                onClick={() => {
                  // El texto buscado y el rubro también filtran: sin borrarlos seguía en 0.
                  setSearch("");
                  setDebouncedSearch("");
                  setVertical(undefined);
                  setCategory(null);
                  setDistrict(null);
                  setFilters(EMPTY_FILTERS);
                  window.history.replaceState(null, "", window.location.pathname);
                }}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary ring-1 ring-primary/40 transition hover:bg-primary-50 dark:bg-neutral-900"
              >
                Quitar todos los filtros
              </button>
              <WuarikesHereForm />
            </div>
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
