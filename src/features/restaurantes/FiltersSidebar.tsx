"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useAmenities, useCategories } from "@/hooks/usePlaces";

export interface AdvancedFilters {
  amenities: string[];
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  openNow: boolean;
  hasLoyalty: boolean;
}

export const EMPTY_FILTERS: AdvancedFilters = {
  amenities: [],
  openNow: false,
  hasLoyalty: false,
};

// Solo presentación: el backend no trae íconos. Lo que no esté acá usa ✨.
const CATEGORY_EMOJI: Record<string, string> = {
  buffet: "🍱",
  cafe: "☕",
  carretilla: "🛒",
  chifa: "🥡",
  "comida-rapida": "🍔",
  criollo: "🍲",
  italiana: "🍝",
  japonesa: "🍣",
  juguerias: "🥤",
  marino: "🐟",
  mexicana: "🌮",
  pollo: "🍗",
  "pollo-a-la-brasa": "🔥",
  postres: "🍰",
  sangucheria: "🥪",
  sopas: "🍜",
  barberia: "💈",
  peluqueria: "💇",
  spa: "💆",
  unas: "💅",
};

const AMENITY_EMOJI: Record<string, string> = {
  ac: "❄️",
  bar: "🍹",
  "bring-own-drinks": "🍾",
  delivery: "🛵",
  parking: "🅿️",
  "full-aire": "🌬️",
  "kids-games": "🧸",
  "musica-vivo": "🎸",
  "card-payment": "💳",
  "pet-friendly": "🐶",
  "gluten-free": "🌾",
  terrace: "☀️",
  tv: "📺",
  "tv-futbol": "⚽",
  vegan: "🥗",
  wifi: "📶",
  "digital-payment": "📱",
  "smoking-area": "🚬",
};

const PRICE_TIERS = [
  { emoji: "🪙", label: "Al paso", hint: "hasta S/ 20", min: undefined, max: 20 },
  { emoji: "🍽️", label: "Normalito", hint: "S/ 20 – 50", min: 20, max: 50 },
  { emoji: "✨", label: "Un gustito", hint: "S/ 50 a más", min: 50, max: undefined },
];

const RATING_TIERS = [
  { emoji: "😊", value: 3 },
  { emoji: "😋", value: 4 },
  { emoji: "🤩", value: 4.5 },
];

const AMENITIES_PREVIEW = 8;

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2.5 font-heading text-sm font-bold text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition active:scale-95 ${
        active
          ? "bg-primary text-white shadow-sm shadow-primary/30"
          : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:ring-primary/50 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({
  emoji,
  label,
  checked,
  onChange,
}: {
  emoji: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        checked
          ? "bg-primary-50 text-primary-700 ring-1 ring-primary/40 dark:bg-primary-900/30 dark:text-primary-200"
          : "bg-white text-neutral-700 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700"
      }`}
    >
      <span>
        <span className="mr-2 text-base">{emoji}</span>
        {label}
      </span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-primary" : "bg-neutral-300 dark:bg-neutral-600"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

export function FiltersSidebar({
  category,
  vertical,
  onCategoryChange,
  filters,
  onFiltersChange,
}: {
  category: string | null;
  vertical?: string;
  onCategoryChange: (category: string | null) => void;
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const { data: categories } = useCategories(vertical);
  const { data: amenities } = useAmenities();

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const set = (patch: Partial<AdvancedFilters>) => onFiltersChange({ ...filters, ...patch });

  function toggleAmenity(slug: string) {
    set({
      amenities: filters.amenities.includes(slug)
        ? filters.amenities.filter((s) => s !== slug)
        : [...filters.amenities, slug],
    });
  }

  function clearAll() {
    onCategoryChange(null);
    onFiltersChange(EMPTY_FILTERS);
  }

  const activeCount =
    (category ? 1 : 0) +
    filters.amenities.length +
    (filters.openNow ? 1 : 0) +
    (filters.hasLoyalty ? 1 : 0) +
    (filters.minRating != null ? 1 : 0) +
    (filters.priceMin != null || filters.priceMax != null ? 1 : 0);

  const visibleAmenities = showAllAmenities
    ? (amenities ?? [])
    : (amenities ?? []).slice(0, AMENITIES_PREVIEW);

  const content = (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg font-bold text-neutral-900 dark:text-neutral-50">
          ¿Qué plan tienes? 🤔
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Toggle
          emoji="🟢"
          label="Abierto ahora"
          checked={filters.openNow}
          onChange={(openNow) => set({ openNow })}
        />
        <Toggle
          emoji="🎁"
          label="Con premios"
          checked={filters.hasLoyalty}
          onChange={(hasLoyalty) => set({ hasLoyalty })}
        />
      </div>

      {categories && categories.length > 0 && (
        <Group title="Antojo">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                active={category === cat.slug}
                onClick={() => onCategoryChange(category === cat.slug ? null : cat.slug)}
              >
                <span>{CATEGORY_EMOJI[cat.slug.toLowerCase()] ?? "✨"}</span>
                {cat.name}
              </Chip>
            ))}
          </div>
        </Group>
      )}

      <Group title="¿Cuánto quieres gastar?">
        <div className="grid grid-cols-3 gap-2">
          {PRICE_TIERS.map((tier) => {
            const active = filters.priceMin === tier.min && filters.priceMax === tier.max;
            return (
              <button
                key={tier.label}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  set(
                    active
                      ? { priceMin: undefined, priceMax: undefined }
                      : { priceMin: tier.min, priceMax: tier.max },
                  )
                }
                className={`flex flex-col items-center gap-0.5 rounded-2xl px-1 py-3 text-center transition active:scale-95 ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "bg-white text-neutral-800 ring-1 ring-neutral-200 hover:ring-primary/50 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-700"
                }`}
              >
                <span className="text-2xl">{tier.emoji}</span>
                <span className="text-xs font-bold">{tier.label}</span>
                <span className={`text-[10px] ${active ? "text-white/80" : "text-neutral-500"}`}>
                  {tier.hint}
                </span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="¿Qué tan bueno?">
        <div className="grid grid-cols-3 gap-2">
          {RATING_TIERS.map(({ emoji, value }) => {
            const active = filters.minRating === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                aria-label={`${value} estrellas o más`}
                onClick={() => set({ minRating: active ? undefined : value })}
                className={`flex flex-col items-center rounded-2xl py-2.5 transition active:scale-95 ${
                  active
                    ? "bg-secondary/30 ring-2 ring-secondary"
                    : "bg-white ring-1 ring-neutral-200 hover:ring-secondary dark:bg-neutral-900 dark:ring-neutral-700"
                }`}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100">
                  ★ {value}+
                </span>
              </button>
            );
          })}
        </div>
      </Group>

      {visibleAmenities.length > 0 && (
        <Group title="Que tenga…">
          <div className="flex flex-wrap gap-2">
            {visibleAmenities.map((amenity) => (
              <Chip
                key={amenity.id}
                active={filters.amenities.includes(amenity.slug)}
                onClick={() => toggleAmenity(amenity.slug)}
              >
                <span>{AMENITY_EMOJI[amenity.slug] ?? "✨"}</span>
                {amenity.name}
              </Chip>
            ))}
          </div>
          {(amenities?.length ?? 0) > AMENITIES_PREVIEW && (
            <button
              type="button"
              onClick={() => setShowAllAmenities((v) => !v)}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              {showAllAmenities ? "Ver menos" : `Ver ${amenities!.length - AMENITIES_PREVIEW} más`}
            </button>
          )}
        </Group>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm ring-1 ring-neutral-200 transition active:scale-95 lg:hidden dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-700"
      >
        <SlidersHorizontal size={15} className="text-primary" />
        Filtros
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] text-white">
            {activeCount}
          </span>
        )}
      </button>

      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto rounded-3xl bg-neutral-100/70 p-5 [scrollbar-width:thin] dark:bg-neutral-900/60">
          {content}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 pt-3">
              <span className="mx-auto h-1.5 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar filtros"
                className="absolute top-3 right-4 rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pt-4 pb-6">{content}</div>
            <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 active:scale-[0.98]"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
