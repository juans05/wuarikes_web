import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { RatingStars } from "@/components/common/RatingStars";
import { OpenNowBadge } from "@/components/common/OpenNowBadge";
import { FavoriteButton } from "@/features/restaurant/FavoriteButton";
import type { Place } from "@/types/place";

export function PlaceCard({
  place,
  onShowOnMap,
}: {
  place: Place;
  onShowOnMap?: (place: Place) => void;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg dark:bg-neutral-900">
      <Link
        href={`/restaurantes/${place.id}`}
        aria-label={place.name}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      />
      <div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-800">
        {place.coverImageUrl ? (
          <Image
            src={place.coverImageUrl}
            alt={place.name}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo-icon.jpg"
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 rounded-2xl opacity-60 shadow-sm"
            />
          </div>
        )}
        <div className="absolute top-2 right-2 z-20">
          <FavoriteButton placeId={place.id} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading line-clamp-1 font-semibold text-neutral-900 dark:text-neutral-50">
            {place.name}
          </h3>
          {place.averagePrice != null && (
            <span className="shrink-0 text-sm font-medium text-primary">
              {"S/ ".concat(place.averagePrice.toFixed(0))}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <RatingStars rating={place.rating} />
          <span>
            {place.rating.toFixed(1)} ({place.totalReviews})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <p className="line-clamp-1 flex-1 text-sm text-neutral-500">
            {place.category?.name}
            {place.district?.name ? ` · ${place.district.name}` : ""}
          </p>
          <OpenNowBadge openHoursText={place.openHoursText} />
        </div>

        {place.address && (
          <div className="mt-auto flex items-center gap-2">
            <p className="flex min-w-0 flex-1 items-center gap-1 text-xs text-neutral-400">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{place.address}</span>
            </p>
            {onShowOnMap && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onShowOnMap(place);
                }}
                className="relative z-20 shrink-0 text-xs font-medium text-primary hover:underline"
              >
                Mostrar en mapa
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
