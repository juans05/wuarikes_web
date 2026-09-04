import { useMutation, useQuery } from "@tanstack/react-query";
import {
  claimPlace,
  getAmenities,
  getCategories,
  getFriendsVisited,
  getMostFavorited,
  getPlace,
  getPlaceMenu,
  getPlaces,
  getPromotions,
  getRatingDistribution,
  getRecommendations,
  getTrending,
  getTrustStage,
  searchTikTok,
  submitPlace,
} from "@/services/places.service";
import { useAuthStore } from "@/stores/auth.store";
import type { PlacesQuery } from "@/types/place";

export function useTrending(district?: string, category?: string) {
  return useQuery({
    queryKey: ["places", "trending", district, category],
    queryFn: () => getTrending(district, category),
  });
}

export function useMostFavorited() {
  return useQuery({
    queryKey: ["places", "most-favorited"],
    queryFn: () => getMostFavorited(),
  });
}

export function useRecommendations(query: PlacesQuery, enabled: boolean) {
  return useQuery({
    queryKey: ["places", "recommendations", query],
    queryFn: () => getRecommendations(query),
    enabled,
  });
}

export function useTrustStage(placeId: string) {
  return useQuery({
    queryKey: ["place", placeId, "trust-stage"],
    queryFn: () => getTrustStage(placeId),
    enabled: Boolean(placeId),
  });
}

export function useFriendsVisited(placeId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["place", placeId, "friends-visited"],
    queryFn: () => getFriendsVisited(placeId),
    enabled: Boolean(placeId) && isAuthenticated,
  });
}

export function usePlaces(query: PlacesQuery) {
  return useQuery({
    queryKey: ["places", query],
    queryFn: () => getPlaces(query),
  });
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: ["place", id],
    queryFn: () => getPlace(id),
    enabled: Boolean(id),
  });
}

export function usePlaceMenu(id: string) {
  return useQuery({
    queryKey: ["place", id, "menu"],
    queryFn: () => getPlaceMenu(id),
    enabled: Boolean(id),
  });
}

export function useRatingDistribution(id: string) {
  return useQuery({
    queryKey: ["place", id, "rating-distribution"],
    queryFn: () => getRatingDistribution(id),
    enabled: Boolean(id),
  });
}

export function usePromotions(id: string) {
  return useQuery({
    queryKey: ["place", id, "promotions"],
    queryFn: () => getPromotions(id),
    enabled: Boolean(id),
  });
}

// Se dispara al entrar a la página (solo si el lugar no tiene videos
// cacheados todavía — ver TikTokSection). `enabled: false` por defecto,
// el consumidor lo activa una vez cuando corresponde.
export function useSearchTikTok(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ["place", id, "tiktok-search"],
    queryFn: () => searchTikTok(id),
    enabled: enabled && Boolean(id),
    staleTime: Infinity,
    retry: false,
  });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: getCategories });
}

export function useAmenities() {
  return useQuery({ queryKey: ["amenities"], queryFn: getAmenities });
}

export function useSubmitPlace() {
  return useMutation({ mutationFn: submitPlace });
}

export function useClaimPlace() {
  return useMutation({
    mutationFn: ({ placeId, input }: { placeId: string; input: Parameters<typeof claimPlace>[1] }) =>
      claimPlace(placeId, input),
  });
}
