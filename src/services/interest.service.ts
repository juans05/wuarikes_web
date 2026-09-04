import { apiClient } from "@/api/client";

export async function getInterest(placeId: string) {
  const { data } = await apiClient.get<{ isInterested: boolean; count: number }>(
    `/places/${placeId}/interest`,
  );
  return data;
}

export async function addInterest(placeId: string) {
  await apiClient.post(`/places/${placeId}/interest`);
}

export async function removeInterest(placeId: string) {
  await apiClient.delete(`/places/${placeId}/interest`);
}
