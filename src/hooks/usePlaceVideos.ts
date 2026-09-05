import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaceVideos, uploadPlaceVideo } from "@/services/videos.service";

export function usePlaceVideos(placeId: string) {
  return useQuery({
    queryKey: ["place", placeId, "videos"],
    queryFn: () => getPlaceVideos(placeId),
    enabled: Boolean(placeId),
  });
}

export function useUploadPlaceVideo(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadPlaceVideo(placeId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["place", placeId, "videos"] });
    },
  });
}
