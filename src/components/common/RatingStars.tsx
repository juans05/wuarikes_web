import { Star } from "lucide-react";
import clsx from "clsx";

export function RatingStars({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={clsx(
            i < Math.round(rating)
              ? "fill-secondary text-secondary"
              : "fill-transparent text-neutral-300 dark:text-neutral-600",
          )}
        />
      ))}
    </div>
  );
}
