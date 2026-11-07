"use client";

import { rubroQuery } from "@/hooks/useVerticalFilter";
import type { Category, Place } from "@/types/place";
import { PlaceRow } from "./PlaceRow";

export function CategoryRow({
  category,
  places,
  vertical,
}: {
  category: Category;
  places: Place[];
  vertical?: string;
}) {
  return (
    <PlaceRow
      title={category.name}
      subtitle="Wuarikes recomienda"
      href={`/restaurantes?categoria=${encodeURIComponent(category.slug)}${rubroQuery(vertical)}`}
      places={places}
    />
  );
}
