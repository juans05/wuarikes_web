export interface Checkin {
  id: string;
  placeId: string;
  user: { id: string; fullName: string; avatarUrl: string | null };
  comment: string | null;
  rating: number;
  photoUrl: string | null;
  photos: string[];
  likesCount: number;
  isLikedByMe: boolean;
  createdAt: string;
  place?: { id: string; name: string; slug: string; coverImageUrl: string | null };
}

export interface MyCheckin {
  id: string;
  comment: string | null;
  rating: number | null;
  photoUrl: string | null;
  likesCount: number;
  createdAt: string;
  place: { id: string; name: string; photoUrl: string | null };
}
