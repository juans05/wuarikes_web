"use client";

import { useState } from "react";
import { Skeleton } from "@/components/common/Skeleton";
import { usePlace } from "@/hooks/usePlaces";
import { RestaurantHero } from "./RestaurantHero";
import { RestaurantSidebar } from "./RestaurantSidebar";
import { ActionBar } from "./ActionBar";
import { TrustBadge } from "./TrustBadge";
import { FriendsVisited } from "./FriendsVisited";
import { MenuSection } from "./MenuSection";
import { TopDishes } from "./TopDishes";
import { ReviewsSection } from "./ReviewsSection";
import { PromotionsSection } from "./PromotionsSection";
import { ExtendedProfileSection } from "./ExtendedProfileSection";
import { GallerySection } from "./GallerySection";
import { TikTokSection } from "./TikTokSection";
import { LocationHoursSection } from "./LocationHoursSection";
import { InfoCheckPrompt } from "./InfoCheckPrompt";

export function RestaurantView({ id }: { id: string }) {
  const { data: place, isLoading, isError } = usePlace(id);
  const [showInfoCheck, setShowInfoCheck] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 pb-24">
        <Skeleton className="h-[300px] w-full rounded-none sm:h-[420px] sm:rounded-b-[2rem] lg:h-[480px]" />
        <div className="flex flex-col gap-3 px-4 lg:px-8">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }
  if (isError || !place) {
    return (
      <p className="p-8 text-center text-sm text-red-500">
        No se pudo cargar este restaurante.
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-8 pb-24">
      <RestaurantHero
        place={place}
        onSeeAllPhotos={() => document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth" })}
      />

      <div className="grid gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 xl:px-12">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-col gap-2">
            <TrustBadge placeId={place.id} />
            <FriendsVisited placeId={place.id} />
          </div>

          <ActionBar
            placeId={place.id}
            placeName={place.name}
            onCheckedIn={() => setShowInfoCheck(true)}
          />

          {showInfoCheck && <InfoCheckPrompt place={place} />}

          {place.description && (
            <p className="text-sm text-neutral-700 dark:text-neutral-300">{place.description}</p>
          )}

          <PromotionsSection place={place} />

          <MenuSection placeId={place.id} />

          <TopDishes placeId={place.id} />

          <GallerySection placeId={place.id} />

          <TikTokSection place={place} />

          <ExtendedProfileSection place={place} />

          <LocationHoursSection place={place} />

          <ReviewsSection place={place} onCheckedIn={() => setShowInfoCheck(true)} />
        </div>

        <RestaurantSidebar place={place} />
      </div>
    </div>
  );
}
