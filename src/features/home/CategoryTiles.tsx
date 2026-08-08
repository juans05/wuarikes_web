"use client";

import Link from "next/link";
import {
  Beef,
  Coffee,
  CupSoda,
  Drumstick,
  Fish,
  Flame,
  IceCream,
  Pizza,
  Sandwich,
  ShoppingCart,
  Soup,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types/place";

const ICONS_BY_SLUG: Record<string, LucideIcon> = {
  buffet: UtensilsCrossed,
  cafe: Coffee,
  carretilla: ShoppingCart,
  chifa: Soup,
  "comida-rapida": Sandwich,
  criollo: Beef,
  italiana: Pizza,
  japonesa: Fish,
  juguerias: CupSoda,
  marino: Fish,
  mexicana: Pizza,
  pollo: Drumstick,
  "pollo-a-la-brasa": Flame,
  postres: IceCream,
  sangucheria: Sandwich,
  sopas: Soup,
};

const TILE_COLORS = ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral-800"];

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
      {categories.map((category, i) => {
        const Icon = ICONS_BY_SLUG[category.slug.toLowerCase()] ?? UtensilsCrossed;
        return (
          <Link
            key={category.id}
            href={`/restaurantes?categoria=${encodeURIComponent(category.slug)}`}
            className={`flex w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl py-6 text-white transition hover:opacity-90 ${TILE_COLORS[i % TILE_COLORS.length]}`}
          >
            <Icon size={26} />
            <span className="text-center text-xs font-semibold">{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
