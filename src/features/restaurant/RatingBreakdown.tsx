import { RatingStars } from "@/components/common/RatingStars";
import { useRatingDistribution } from "@/hooks/usePlaces";

export function RatingBreakdown({
  placeId,
  rating,
  totalReviews,
}: {
  placeId: string;
  rating: number;
  totalReviews: number;
}) {
  const { data: distribution } = useRatingDistribution(placeId);
  const counts = distribution ?? [5, 4, 3, 2, 1].map((star) => ({ rating: star, count: 0 }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-5 sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-900/40">
      <div className="flex shrink-0 flex-col items-center gap-1.5 sm:border-r sm:border-neutral-200 sm:pr-6 dark:sm:border-neutral-800">
        <span className="font-heading text-5xl leading-none font-bold text-neutral-900 dark:text-white">
          {rating.toFixed(1)}
        </span>
        <RatingStars rating={rating} size={18} />
        <span className="text-xs text-neutral-500">{totalReviews} reseñas</span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        {counts.map(({ rating: star, count }) => (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-3 font-medium text-neutral-500">{star}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: count > 0 ? `${Math.max(4, (count / max) * 100)}%` : "0%" }}
              />
            </div>
            <span className="w-4 text-neutral-500">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
