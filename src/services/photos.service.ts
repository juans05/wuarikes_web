import { apiClient } from "@/api/client";
import type { PaginatedResponse } from "@/types/place";
import type { PlacePhoto } from "@/types/photo";

export async function getPlacePhotos(placeId: string, page = 1, limit = 20) {
  const { data } = await apiClient.get<PaginatedResponse<PlacePhoto>>(
    `/places/${placeId}/photos`,
    { params: { page, limit } },
  );
  return data;
}

export async function uploadPlacePhoto(placeId: string, file: File) {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await apiClient.post<PlacePhoto>(`/places/${placeId}/photos`, formData);
  return data;
}
