"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Heart } from "lucide-react";
import { RatingStars } from "@/components/common/RatingStars";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";
import { useCheckinsFeed, useLikeCheckin } from "@/hooks/useCheckins";
import { CheckinCardSkeleton } from "@/components/common/Skeleton";
import { formatRelativeDate } from "@/utils/formatDate";
import { RatingBreakdown } from "./RatingBreakdown";
import { CreateReviewForm } from "./CreateReviewForm";
import type { Place } from "@/types/place";

type SortOption = "recent" | "top" | "low" | "photos";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Más recientes",
  top: "Mayor puntuación",
  low: "Menor puntuación",
  photos: "Con fotos",
};

export function ReviewsSection({
  place,
  onCheckedIn,
}: {
  place: Place;
  onCheckedIn?: () => void;
}) {
  const [sort, setSort] = useState<SortOption>("recent");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const { data, isLoading } = useCheckinsFeed({
    placeId: place.id,
    size: 50,
    sort: sort === "top" ? "top_rated" : sort === "low" ? "low_rated" : "recent",
    hasPhotos: sort === "photos" || undefined,
  });
  const likeMutation = useLikeCheckin();
  const checkins = data?.data ?? [];

  return (
    <section id="resenas" className="scroll-mt-4 flex flex-col gap-5">
      <h2 className="text-lg font-semibold">Reseñas</h2>

      <RatingBreakdown
        placeId={place.id}
        rating={place.rating}
        totalReviews={place.totalReviews}
      />

      {isAuthenticated ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowReviewForm((v) => !v)}
            className="self-start text-sm font-medium text-primary hover:underline"
          >
            {showReviewForm ? "Cancelar reseña" : "Escribir reseña"}
          </button>
          {showReviewForm && (
            <CreateReviewForm
              placeId={place.id}
              onCheckedIn={() => {
                onCheckedIn?.();
                setShowReviewForm(false);
              }}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-neutral-100 p-3 text-sm text-neutral-500 dark:bg-neutral-800">
          Inicia sesión para dejar una reseña.
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-600"
          >
            Iniciar sesión
          </button>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto">
        {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSort(option)}
            className={clsx(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition",
              sort === option
                ? "bg-primary text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300",
            )}
          >
            {SORT_LABELS[option]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }, (_, i) => (
            <CheckinCardSkeleton key={i} />
          ))}
        </div>
      )}
      {!isLoading && checkins.length === 0 && (
        <p className="text-sm text-neutral-500">Todavía no hay reseñas.</p>
      )}

      <ul className="flex flex-col gap-4">
        {checkins.map((checkin) => (
          <li
            key={checkin.id}
            className="flex flex-col gap-3 rounded-2xl border border-neutral-100 p-4 dark:border-neutral-800"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900">
                {checkin.user.avatarUrl ? (
                  <Image
                    src={checkin.user.avatarUrl}
                    alt={checkin.user.fullName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-heading text-sm font-semibold text-primary-700 dark:text-primary-200">
                    {checkin.user.fullName?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{checkin.user.fullName}</span>
                  <span className="text-xs text-neutral-400">
                    {formatRelativeDate(checkin.createdAt)}
                  </span>
                </div>
                <RatingStars rating={checkin.rating} size={14} />
              </div>
            </div>

            {checkin.comment && (
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{checkin.comment}</p>
            )}

            {(checkin.photoUrl || checkin.photos.length > 0) && (
              <div className="flex gap-2 overflow-x-auto">
                {[checkin.photoUrl, ...checkin.photos]
                  .filter((url): url is string => Boolean(url))
                  .map((url) => (
                    <div
                      key={url}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-700"
                    >
                      <Image src={url} alt="" fill className="object-cover" />
                    </div>
                  ))}
              </div>
            )}

            <button
              type="button"
              disabled={!isAuthenticated || likeMutation.isPending}
              onClick={() => likeMutation.mutate({ id: checkin.id, liked: checkin.isLikedByMe })}
              className={clsx(
                "flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition disabled:opacity-50",
                checkin.isLikedByMe
                  ? "bg-primary-50 text-primary dark:bg-primary-900/40"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              <Heart size={14} className={clsx(checkin.isLikedByMe && "fill-primary")} />
              {checkin.likesCount}
            </button>
          </li>
        ))}
      </ul>

      {place.googleReviews && place.googleReviews.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-neutral-500 mb-3">Reseñas de Google</h3>
          <ul className="flex flex-col gap-4">
            {[...place.googleReviews]
              .sort((a, b) => b.time - a.time)
              .map((review) => (
                <li
                  key={review.id}
                  className="flex flex-col gap-3 rounded-2xl border border-neutral-100 p-4 dark:border-neutral-800"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                      {review.authorPhotoUrl ? (
                        <Image
                          src={review.authorPhotoUrl}
                          alt={review.authorName}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-heading text-sm font-semibold text-neutral-500">
                          {review.authorName?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{review.authorName}</span>
                        <span className="text-xs text-neutral-400">
                          {review.relativeTimeDescription}
                        </span>
                      </div>
                      <RatingStars rating={review.rating} size={14} />
                    </div>
                  </div>

                  {review.text && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{review.text}</p>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </section>
  );
}
