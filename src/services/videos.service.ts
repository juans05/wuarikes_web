import { apiClient } from "@/api/client";
import type { PaginatedResponse } from "@/types/place";
import type { PlaceVideo } from "@/types/video";

export async function getPlaceVideos(placeId: string, page = 1, limit = 12) {
  const { data } = await apiClient.get<PaginatedResponse<PlaceVideo>>(
    `/places/${placeId}/videos`,
    { params: { page, limit } },
  );
  return data;
}

export async function uploadPlaceVideo(placeId: string, file: File) {
  const formData = new FormData();
  formData.append("video", file);
  const { data } = await apiClient.post<PlaceVideo>(`/places/${placeId}/videos`, formData);
  return data;
}
