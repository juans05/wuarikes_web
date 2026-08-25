"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { RatingStars } from "@/components/common/RatingStars";
import { OpenNowBadge } from "@/components/common/OpenNowBadge";
import { useCheckinsFeed } from "@/hooks/useCheckins";
import type { Place } from "@/types/place";

export function RestaurantHero({
  place,
  onSeeAllPhotos,
}: {
  place: Place;
  onSeeAllPhotos: () => void;
}) {
  const { data } = useCheckinsFeed({ placeId: place.id, size: 12, hasPhotos: true });
  const communityPhotos = (data?.data ?? []).flatMap((c) =>
    [c.photoUrl, ...c.photos].filter((url): url is string => Boolean(url)),
  );
  const photos = [place.coverImageUrl, ...communityPhotos]
    .filter((url): url is string => Boolean(url))
    .slice(0, 5);

  const totalPhotos = photos.length + Math.max(0, communityPhotos.length - photos.length + 1);

  return (
    <div className="relative h-[300px] w-full overflow-hidden bg-neutral-900 sm:h-[420px] sm:rounded-b-[2rem] lg:h-[480px]">
      {photos.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-800 via-primary-900 to-neutral-950">
          <span className="font-heading text-3xl text-primary-100/40">{place.name}</span>
        </div>
      ) : (
        <div className="flex h-full w-full">
          {photos.map((url, i) => (
            <div
              key={url + i}
              className="relative h-full flex-1 border-r border-black/20 last:border-r-0"
              style={{ minWidth: photos.length === 1 ? "100%" : "0" }}
            >
              <Image
                src={url}
                alt={i === 0 ? place.name : `Foto de la comunidad en ${place.name}`}
                fill
                priority={i === 0}
                sizes="(max-width: 640px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Scrim para legibilidad del panel inferior */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <Link
        href="/"
        className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-lg backdrop-blur transition hover:bg-white"
        aria-label="Volver"
      >
        <ArrowLeft size={18} />
      </Link>

      {photos.length > 0 && (
        <button
          type="button"
          onClick={onSeeAllPhotos}
          className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black/65"
        >
          <Camera size={14} />
          Ver {totalPhotos} fotos
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {place.category?.name && (
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white uppercase backdrop-blur">
              {place.category.name}
            </span>
          )}
          {place.isVerified && (
            <span className="rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-semibold text-neutral-900">
              Verificado
            </span>
          )}
          <OpenNowBadge openHoursText={place.openHoursText} openingHours={place.openingHours} />
        </div>

        <h1 className="font-heading text-3xl leading-tight font-bold text-white drop-shadow-sm sm:text-4xl">
          {place.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={place.rating} size={16} />
            <span className="font-medium">{place.rating.toFixed(1)}</span>
          </div>
          <span>({place.totalReviews} reseñas)</span>
          {place.district?.name && <span>· {place.district.name}</span>}
        </div>
      </div>
    </div>
  );
}
