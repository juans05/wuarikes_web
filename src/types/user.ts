export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  bio: string | null;
  city: string | null;
  hometown: string | null;
  pronouns: string | null;
  gender: string | null;
  birthDate: string | null;
  role: string;
  totalPoints: number;
  level: number;
  levelName: string;
  checkinsCount: number;
  // reviewsCount/photosCount/videosCount siempre vienen en 0 desde el backend
  // (no implementado todavía, ver BACKEND_ANALISIS.md).
  reviewsCount: number;
  photosCount: number;
  videosCount: number;
  followersCount: number;
  followingCount: number;
  memberSince: string;
  isProfilePublic: boolean;
  areFavoritesPublic: boolean;
  allowBusinessMessages: boolean;
  isDiscoverable: boolean;
  badges: { id: string; name: string; iconUrl: string | null }[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string | null;
}

export interface Connection {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  followedAt: string;
}
