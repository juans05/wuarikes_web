"use client";

import Image from "next/image";
import Link from "next/link";
import type { SyntheticEvent } from "react";

// Fotos importadas de Google Maps caducan (403): ocultarlas deja ver el fondo de marca.
export const hideBrokenImage = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};
import { MapPin, Star } from "lucide-react";
import { OpenNowBadge } from "@/components/common/OpenNowBadge";
import { BenefitBadge } from "@/components/common/BenefitBadge";
import { FavoriteButton } from "@/features/restaurant/FavoriteButton";
import type { Place } from "@/types/place";

export function PlaceCard({
  place,
  onShowOnMap,
}: {
  place: Place;
  onShowOnMap?: (place: Place) => void;
}) {
  const price = place.priceMin ?? place.averagePrice;

  return (
    <div className="group relative flex flex-col">
      <Link
        href={`/restaurantes/${place.id}`}
        aria-label={place.name}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      />
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        {/* Debajo de la foto: se ve si no hay foto o si el enlace caducó. */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary/30 dark:from-neutral-800 dark:to-neutral-900">
          <Image
            src="/logo-icon.jpg"
            alt=""
            width={64}
            height={64}
            className="h-14 w-14 rounded-2xl opacity-70 shadow-sm"
          />
        </div>
        {place.coverImageUrl && (
          <Image
            src={place.coverImageUrl}
            alt={place.name}
            fill
            sizes="(max-width: 640px) 80vw, 320px"
            onError={hideBrokenImage}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {place.category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur">
            {place.category.name}
          </span>
        )}
        <div className="absolute top-2 right-2 z-20">
          <FavoriteButton placeId={place.id} />
        </div>
        {place.totalReviews > 0 && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-neutral-900/80 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
            <Star size={12} className="fill-secondary text-secondary" />
            {place.rating.toFixed(1)}
            <span className="font-normal text-white/70">({place.totalReviews})</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
        {place.district?.name && (
          <p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
            {place.district.name}
          </p>
        )}
        <h3 className="font-heading line-clamp-1 text-lg leading-snug font-semibold text-neutral-900 dark:text-neutral-50">
          {place.name}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {price != null && (
            <span className="text-neutral-600 dark:text-neutral-300">
              Desde <strong className="font-semibold">S/ {price.toFixed(0)}</strong>
            </span>
          )}
          <OpenNowBadge openHoursText={place.openHoursText} openingHours={place.openingHours} />
          <BenefitBadge hasActiveBenefit={place.hasActiveBenefit} />
        </div>

        {place.address && onShowOnMap && (
          <div className="mt-1 flex items-center gap-2">
            <p className="flex min-w-0 flex-1 items-center gap-1 text-xs text-neutral-400">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{place.address}</span>
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShowOnMap(place);
              }}
              className="relative z-20 shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Ver en mapa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
