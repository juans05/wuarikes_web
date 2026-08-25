import { apiClient } from "@/api/client";

export async function isFavorite(placeId: string) {
  const { data } = await apiClient.get<{ isSaved: boolean }>(
    `/places/${placeId}/favorite`,
  );
  return data.isSaved;
}

export async function addFavorite(placeId: string) {
  await apiClient.post(`/places/${placeId}/favorite`);
}

export async function removeFavorite(placeId: string) {
  await apiClient.delete(`/places/${placeId}/favorite`);
}
