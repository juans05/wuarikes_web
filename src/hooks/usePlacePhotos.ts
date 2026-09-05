import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlacePhotos, uploadPlacePhoto } from "@/services/photos.service";

export function usePlacePhotos(placeId: string) {
  return useQuery({
    queryKey: ["place", placeId, "photos"],
    queryFn: () => getPlacePhotos(placeId),
    enabled: Boolean(placeId),
  });
}

export function useUploadPlacePhoto(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadPlacePhoto(placeId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["place", placeId, "photos"] });
    },
  });
}
