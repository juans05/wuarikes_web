import { apiClient } from "@/api/client";
import { normalizePlace } from "./places.service";
import type { PaginatedResponse, Place } from "@/types/place";
import type { Badge, Connection, UserProfile } from "@/types/user";
import type { MyCheckin } from "@/types/checkin";

export async function getMyFavorites(page = 1, limit = 20) {
  const { data } = await apiClient.get<PaginatedResponse<Place>>(
    "/users/me/favorites",
    { params: { page, limit } },
  );
  return { ...data, data: data.data.map(normalizePlace) };
}

export async function getMyProfile() {
  const { data } = await apiClient.get<UserProfile>("/users/me/profile");
  return data;
}

export async function updateProfile(dto: {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  city?: string;
  hometown?: string;
  pronouns?: string;
  gender?: string;
  birthDate?: string;
}) {
  const { data } = await apiClient.patch<{ message: string }>("/users/me/profile", dto);
  return data;
}

export async function updatePrivacy(dto: {
  isProfilePublic?: boolean;
  areFavoritesPublic?: boolean;
  allowBusinessMessages?: boolean;
  isDiscoverable?: boolean;
}) {
  const { data } = await apiClient.patch<{ message: string }>("/users/me/privacy", dto);
  return data;
}

export async function getBadges() {
  const { data } = await apiClient.get<Badge[]>("/gamification/badges");
  return data;
}

export async function getMyFollowers(page = 1, limit = 20) {
  const { data } = await apiClient.get<PaginatedResponse<Connection>>("/users/me/followers", {
    params: { page, limit },
  });
  return data;
}

export async function getMyFollowing(page = 1, limit = 20) {
  const { data } = await apiClient.get<PaginatedResponse<Connection>>("/users/me/following", {
    params: { page, limit },
  });
  return data;
}

export async function getMyCheckins(page = 1, limit = 20) {
  const { data } = await apiClient.get<PaginatedResponse<MyCheckin>>("/users/me/checkins", {
    params: { page, limit },
  });
  return data;
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<{ avatarUrl: string }>("/users/me/avatar", formData);
  return data;
}

export async function uploadCoverImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<{ url: string }>("/upload/image", formData);
  await updateProfile({ coverImageUrl: data.url });
  return data;
}
