import { useQuery } from "@tanstack/react-query";
import { getPlacePhotos } from "@/services/photos.service";

export function usePlacePhotos(placeId: string) {
  return useQuery({
    queryKey: ["place", placeId, "photos"],
    queryFn: () => getPlacePhotos(placeId),
    enabled: Boolean(placeId),
  });
}
