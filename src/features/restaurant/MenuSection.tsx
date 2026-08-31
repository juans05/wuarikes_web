import Image from "next/image";
import clsx from "clsx";
import { UtensilsCrossed } from "lucide-react";
import { usePlaceMenu } from "@/hooks/usePlaces";
import type { Dish } from "@/types/place";
import { SuggestEditButton } from "./SuggestEditButton";

export function MenuSection({ placeId }: { placeId: string }) {
  const { data, isLoading } = usePlaceMenu(placeId);
  const categories = data?.categories ?? [];
  const menuImageUrls = data?.menuImageUrls ?? [];

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Cargando carta...</p>;
  }

  if (categories.length === 0) {
    if (menuImageUrls.length > 0) {
      return (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Carta</h2>
            <SuggestEditButton placeId={placeId} field="menu" />
          </div>
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
            {menuImageUrls.map((url) => (
              <div
                key={url}
                className="relative aspect-[3/4] w-56 shrink-0 snap-start overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
              >
                <Image src={url} alt="Página de la carta" fill sizes="224px" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Carta digital</h2>
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
          <p className="text-sm text-neutral-400">Todavía no hay carta cargada.</p>
          <SuggestEditButton placeId={placeId} field="menu" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Carta digital</h2>
        <SuggestEditButton placeId={placeId} field="menu" />
      </div>
      {categories.map((category) => (
        <div key={category.id} className="flex flex-col gap-3">
          <h3 className="font-heading text-base font-semibold text-neutral-800 dark:text-neutral-200">
            {category.name}
          </h3>
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
            {category.dishes.map((dish) => (
              <DishItem key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function DishItem({ dish }: { dish: Dish }) {
  const ingredients = dish.ingredients ?? [];
  const allergens = dish.allergens ?? [];

  return (
    <div
      className={clsx(
        "flex w-44 shrink-0 snap-start flex-col gap-2 overflow-hidden rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900",
        !dish.isAvailable && "opacity-60",
      )}
    >
      <div className="relative aspect-4/3 w-full shrink-0 bg-neutral-100 dark:bg-neutral-800">
        {dish.imageUrl ? (
          <Image src={dish.imageUrl} alt={dish.name} fill sizes="176px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300 dark:text-neutral-700">
            <UtensilsCrossed size={28} />
          </div>
        )}
        {!dish.isAvailable && (
          <span className="absolute top-2 left-2 rounded-full bg-neutral-900/80 px-2 py-0.5 text-[10px] font-medium text-white">
            Agotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm leading-tight font-medium">{dish.name}</span>
        </div>
        <span className="text-sm font-semibold text-primary">S/ {dish.price.toFixed(0)}</span>
        {dish.description && (
          <p className="line-clamp-2 text-xs text-neutral-500">{dish.description}</p>
        )}
        {ingredients.length > 0 && (
          <p className="text-[11px] text-neutral-400">Contiene: {ingredients.join(", ")}</p>
        )}
        {allergens.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {allergens.map((allergen) => (
              <span
                key={allergen}
                className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-200"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
