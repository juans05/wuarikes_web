import { useQuery } from "@tanstack/react-query";
import { getPlaceVideos } from "@/services/videos.service";

export function usePlaceVideos(placeId: string) {
  return useQuery({
    queryKey: ["place", placeId, "videos"],
    queryFn: () => getPlaceVideos(placeId),
    enabled: Boolean(placeId),
  });
}
