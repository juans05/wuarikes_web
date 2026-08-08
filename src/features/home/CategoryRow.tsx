"use client";

import Link from "next/link";
import { PlaceCard } from "@/components/ui/PlaceCard";
import type { Category, Place } from "@/types/place";

export function CategoryRow({ category, places }: { category: Category; places: Place[] }) {
  if (places.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-heading text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Wuarikes recomienda: {category.name}
        </h2>
        <Link
          href={`/restaurantes?categoria=${encodeURIComponent(category.slug)}`}
          className="shrink-0 text-sm font-semibold text-primary hover:underline"
        >
          Ver todos →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
        {places.map((place) => (
          <div key={place.id} className="w-72 shrink-0">
            <PlaceCard place={place} />
          </div>
        ))}
      </div>
    </section>
  );
}
