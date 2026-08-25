"use client";

import { useQuery } from "@tanstack/react-query";
import { PlaceCardSkeleton } from "@/components/common/Skeleton";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { useAuthStore } from "@/stores/auth.store";
import { getMyFavorites } from "@/services/users.service";

export function FavoritesView() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => getMyFavorites(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <EmptyState message="Inicia sesión para ver y guardar tus restaurantes favoritos." />
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const places = data?.data ?? [];

  if (places.length === 0) {
    return <EmptyState message="Aún no guardaste ningún restaurante." />;
  }

  return (
    <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8 text-center">
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
