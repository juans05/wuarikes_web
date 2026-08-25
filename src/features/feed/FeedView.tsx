"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Heart, MapPin } from "lucide-react";
import { RatingStars } from "@/components/common/RatingStars";
import { CheckinCardSkeleton } from "@/components/common/Skeleton";
import { useAuthStore } from "@/stores/auth.store";
import { useCheckinsFeed, useLikeCheckin } from "@/hooks/useCheckins";
import { formatRelativeDate } from "@/utils/formatDate";

export function FeedView() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading } = useCheckinsFeed({ size: 30 });
  const likeMutation = useLikeCheckin();
  const checkins = data?.data ?? [];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <h1 className="font-heading text-xl font-bold">Actividad reciente</h1>

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <CheckinCardSkeleton key={i} />
          ))}
        </div>
      )}
      {!isLoading && checkins.length === 0 && (
        <p className="py-8 text-center text-sm text-neutral-500">
          Todavía no hay check-ins. ¡Sé el primero!
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {checkins.map((checkin) => (
          <li
            key={checkin.id}
            className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-900"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                {checkin.user.avatarUrl && (
                  <Image
                    src={checkin.user.avatarUrl}
                    alt={checkin.user.fullName}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{checkin.user.fullName}</p>
                {checkin.place && (
                  <Link
                    href={`/restaurantes/${checkin.place.id}`}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <MapPin size={12} />
                    {checkin.place.name}
                  </Link>
                )}
              </div>
              <span className="text-xs text-neutral-400">
                {formatRelativeDate(checkin.createdAt)}
              </span>
            </div>

            <RatingStars rating={checkin.rating} size={14} />

            {checkin.comment && (
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {checkin.comment}
              </p>
            )}

            {checkin.photoUrl && (
              <div className="relative h-48 w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-700">
                <Image src={checkin.photoUrl} alt="" fill className="object-cover" />
              </div>
            )}

            <button
              type="button"
              disabled={!isAuthenticated || likeMutation.isPending}
              onClick={() =>
                likeMutation.mutate({ id: checkin.id, liked: checkin.isLikedByMe })
              }
              className={clsx(
                "flex w-fit items-center gap-1 text-xs transition hover:text-red-500 disabled:opacity-50",
                checkin.isLikedByMe ? "text-red-500" : "text-neutral-500",
              )}
            >
              <Heart size={14} className={clsx(checkin.isLikedByMe && "fill-red-500")} />
              {checkin.likesCount}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
