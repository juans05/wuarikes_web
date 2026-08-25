"use client";

import { Tag } from "lucide-react";
import { usePromotions } from "@/hooks/usePlaces";
import type { Place } from "@/types/place";

export function PromotionsSection({ place }: { place: Place }) {
  const { data: promotions } = usePromotions(place.id);
  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Promociones</h2>
      <div className="flex flex-col gap-2">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="flex items-center gap-3 rounded-2xl border border-dashed border-secondary/50 bg-secondary/10 p-3.5"
          >
            <Tag size={18} className="shrink-0 text-secondary" />
            <div className="flex-1">
              <p className="text-sm font-medium">{promo.title}</p>
              {promo.description && (
                <p className="text-xs text-neutral-500">{promo.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
