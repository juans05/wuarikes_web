"use client";

import { PlaceCard } from "@/components/ui/PlaceCard";
import type { Place } from "@/types/place";

export function PlaceRow({
  title,
  places,
}: {
  title: string;
  places: Place[];
}) {
  if (places.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4">
      <h2 className="mb-4 font-heading text-xl font-bold text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
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
