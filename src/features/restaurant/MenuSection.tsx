"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Check, Clock, Pencil, UtensilsCrossed } from "lucide-react";
import { useBusinessTypes, usePlaceMenu } from "@/hooks/usePlaces";
import { DEFAULT_VERTICAL, verticalOfType } from "@/services/places.service";
import type { Dish } from "@/types/place";
import { useSubmitInfoSuggestion } from "@/hooks/useInfoCheck";
import { PANEL_LOGIN_URL } from "@/lib/business";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";
import { ACTION_PILL } from "./SuggestEditButton";

// Lo que de verdad se puede hacer con la carta: el dueño la edita en el panel; la comunidad
// solo puede avisar que está desactualizada (el backend no acepta cartas de terceros).
function MenuEditAction({
  placeId,
  isOwner,
  empty = false,
}: {
  placeId: string;
  isOwner: boolean;
  empty?: boolean;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const suggest = useSubmitInfoSuggestion();
  const [sent, setSent] = useState(false);

  if (isOwner) {
    return (
      <a href={PANEL_LOGIN_URL} className={ACTION_PILL}>
        <Pencil size={12} /> Editar
      </a>
    );
  }
  if (sent) {
    return (
      <span className={`${ACTION_PILL} text-accent ring-accent/40`}>
        <Check size={12} /> ¡Gracias por avisar!
      </span>
    );
  }
  return (
    <button
      type="button"
      disabled={suggest.isPending}
      onClick={() => {
        if (!isAuthenticated) return openAuthModal("login");
        suggest.mutate({ placeId, field: "menu" }, { onSuccess: () => setSent(true) });
      }}
      className={ACTION_PILL}
    >
      <Pencil size={12} /> {empty ? "Pedir carta" : "¿Desactualizada?"}
    </button>
  );
}

function formatDuration(min: number) {
  const hours = Math.floor(min / 60);
  const rest = min % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function MenuSection({
  placeId,
  businessType,
  isOwner = false,
}: {
  placeId: string;
  businessType?: string;
  isOwner?: boolean;
}) {
  const { data, isLoading } = usePlaceMenu(placeId);
  const { data: businessTypes } = useBusinessTypes();
  const categories = data?.categories ?? [];
  const menuImageUrls = data?.menuImageUrls ?? [];

  // Gastronomía conserva "Carta"/"Carta digital"; el resto usa el nombre del catálogo de su rubro
  // ("Servicios", "Productos"...). Sin datos del backend se comporta como hoy.
  const vertical = verticalOfType(businessTypes, businessType);
  const isFood = !vertical || vertical.key === DEFAULT_VERTICAL;
  const catalog = vertical?.catalogLabel ?? "Carta";

  if (isLoading) {
    return (
      <p className="text-sm text-neutral-500">
        {isFood ? "Cargando carta..." : `Cargando ${catalog.toLowerCase()}...`}
      </p>
    );
  }

  if (categories.length === 0) {
    if (menuImageUrls.length > 0) {
      return (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{isFood ? "Carta" : catalog}</h2>
            <MenuEditAction placeId={placeId} isOwner={isOwner} />
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
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{isFood ? "Carta digital" : catalog}</h2>
          <MenuEditAction placeId={placeId} isOwner={isOwner} empty />
        </div>
        <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
          <p className="text-sm text-neutral-400">
            {isFood
              ? "Todavía no hay carta cargada."
              : `Todavía no cargaron ${catalog.toLowerCase()}.`}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{isFood ? "Carta digital" : catalog}</h2>
        <MenuEditAction placeId={placeId} isOwner={isOwner} />
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
  const photos = dish.images?.length ? dish.images : dish.imageUrl ? [dish.imageUrl] : [];

  return (
    <div
      className={clsx(
        "flex w-44 shrink-0 snap-start flex-col gap-2 overflow-hidden rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900",
        !dish.isAvailable && "opacity-60",
      )}
    >
      <div className="relative aspect-4/3 w-full shrink-0 bg-neutral-100 dark:bg-neutral-800">
        {photos.length > 0 ? (
          <div className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]">
            {photos.map((src, i) => (
              <div key={src + i} className="relative h-full w-full shrink-0 snap-center">
                <Image src={src} alt={`${dish.name} ${i + 1}`} fill sizes="176px" className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300 dark:text-neutral-700">
            <UtensilsCrossed size={28} />
          </div>
        )}
        {photos.length > 1 && (
          <span className="absolute right-2 bottom-2 rounded-full bg-neutral-900/70 px-2 py-0.5 text-[10px] font-medium text-white">
            {photos.length} fotos
          </span>
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
        <span className="text-sm font-semibold text-primary">
          {dish.price != null ? `S/ ${dish.price.toFixed(0)}` : "Consultar"}
        </span>
        {dish.kind === "servicio" && dish.durationMin != null && dish.durationMin > 0 && (
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <Clock size={12} />
            {formatDuration(dish.durationMin)}
          </span>
        )}
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
