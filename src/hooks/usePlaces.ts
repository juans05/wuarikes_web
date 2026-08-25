import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAmenities,
  getCategories,
  getPlace,
  getPlaceMenu,
  getPlaces,
  getPromotions,
  getRatingDistribution,
  searchTikTok,
  submitPlace,
} from "@/services/places.service";
import type { PlacesQuery } from "@/types/place";

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
