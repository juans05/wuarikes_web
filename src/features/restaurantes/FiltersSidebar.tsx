"use client";

import { useEffect, useState } from "react";
import { ChevronDown, SlidersHorizontal, Star, X } from "lucide-react";
import { useAmenities, useCategories } from "@/hooks/usePlaces";

export interface AdvancedFilters {
  amenities: string[];
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  openNow: boolean;
}

export const EMPTY_FILTERS: AdvancedFilters = {
  amenities: [],
  openNow: false,
};

const RATING_TIERS = [3, 3.5, 4, 4.5];

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-sm font-semibold text-neutral-900 dark:text-neutral-50"
      >
        {title}
        <ChevronDown
          size={16}
          className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </section>
  );
}

export function FiltersSidebar({
  category,
  onCategoryChange,
  filters,
  onFiltersChange,
}: {
  category: string | null;
  onCategoryChange: (category: string | null) => void;
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: categories } = useCategories();
  const { data: amenities } = useAmenities();

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  function toggleAmenity(slug: string) {
    const next = filters.amenities.includes(slug)
      ? filters.amenities.filter((s) => s !== slug)
      : [...filters.amenities, slug];
    onFiltersChange({ ...filters, amenities: next });
  }

  function clearAll() {
    onCategoryChange(null);
    onFiltersChange(EMPTY_FILTERS);
  }

  const hasActiveFilters =
    category !== null ||
    filters.amenities.length > 0 ||
    filters.openNow ||
    filters.minRating != null ||
    filters.priceMin != null ||
    filters.priceMax != null;

  const content = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between lg:hidden">
        <span className="text-sm font-semibold">Filtros</span>
        <button type="button" onClick={() => setMobileOpen(false)} aria-label="Cerrar filtros">
          <X size={18} />
        </button>
      </div>

      <CollapsibleSection title="Calificación">
        <div className="flex flex-col gap-1.5">
          {RATING_TIERS.map((value) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.minRating === value}
                onChange={() =>
                  onFiltersChange({
                    ...filters,
                    minRating: filters.minRating === value ? undefined : value,
                  })
                }
              />
              <Star size={14} className="fill-secondary text-secondary" />
              {value}+
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Precio">
        <div className="flex gap-2">
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-neutral-500">Mín. (S/)</p>
            <input
              type="number"
              min={0}
              value={filters.priceMin ?? ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceMin: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full rounded-lg border border-neutral-200 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-neutral-500">Máx. (S/)</p>
            <input
              type="number"
              min={0}
              value={filters.priceMax ?? ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceMax: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full rounded-lg border border-neutral-200 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Categoría">
        <div className="flex flex-col gap-1.5">
          {categories?.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={category === cat.slug}
                onChange={() => onCategoryChange(category === cat.slug ? null : cat.slug)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {amenities && amenities.length > 0 && (
        <CollapsibleSection title="Servicios">
          <div className="flex flex-col gap-1.5">
            {amenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity.slug)}
                  onChange={() => toggleAmenity(amenity.slug)}
                />
                {amenity.name}
              </label>
            ))}
          </div>
        </CollapsibleSection>
      )}

      <section className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
        <span className="text-sm font-medium">Abierto ahora</span>
        <input
          type="checkbox"
          checked={filters.openNow}
          onChange={(e) => onFiltersChange({ ...filters, openNow: e.target.checked })}
        />
      </section>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-left text-xs font-medium text-neutral-500 hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex shrink-0 items-center gap-1.5 self-start rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 lg:hidden dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      >
        <SlidersHorizontal size={15} />
        Filtros
        {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-primary" />}
      </button>

      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-xl dark:bg-neutral-950"
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
}
