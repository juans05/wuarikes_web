import { apiClient } from "@/api/client";
import type { Checkin } from "@/types/checkin";

export interface CheckinsFeedQuery {
  placeId?: string;
  district?: string;
  page?: number;
  size?: number;
  sort?: "recent" | "top_rated" | "low_rated" | "most_liked";
  hasPhotos?: boolean;
}

export interface CheckinsFeedResponse {
  data: Checkin[];
  meta: { total: number; page: number; size: number; totalPages: number };
}

export async function getCheckinsFeed(query: CheckinsFeedQuery) {
  const { data } = await apiClient.get<CheckinsFeedResponse>("/checkins/feed", {
    params: query,
  });
  return data;
}

export interface CreateCheckinInput {
  placeId: string;
  rating?: number;
  comment?: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
}

export async function createCheckin(input: CreateCheckinInput) {
  const { data } = await apiClient.post<Checkin>("/checkins", input);
  return data;
}

export async function likeCheckin(id: string) {
  await apiClient.post(`/checkins/${id}/like`);
}

export async function unlikeCheckin(id: string) {
  await apiClient.delete(`/checkins/${id}/like`);
}
