"use client";

import { useQuery } from "@tanstack/react-query";
import { Utensils } from "lucide-react";
import { getTopDishes } from "@/services/checkins.service";

export function TopDishes({ placeId }: { placeId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["top-dishes", placeId],
    queryFn: () => getTopDishes(placeId),
  });

  if (isLoading || !data || data.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
        <Utensils size={18} className="text-primary" />
        Lo que está pidiendo la gente
      </h2>
      <ul className="flex flex-col gap-2">
        {data.map((dish, i) => (
          <li
            key={dish.dishName}
            className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-2.5 dark:bg-neutral-900"
          >
            <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800 dark:text-neutral-100">
              <span className="text-xs font-bold text-neutral-400">#{i + 1}</span>
              {dish.dishName}
            </span>
            <span className="text-xs font-semibold text-neutral-500">
              {dish.orders} {dish.orders === 1 ? "pedido" : "pedidos"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
