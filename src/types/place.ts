export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Amenity {
  id: string;
  name: string;
  slug: string;
  iconUrl: string;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: Category | null;
  district: { id: string; name: string } | null;
  address: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  coverImageUrl: string | null;
  status: "active" | "inactive" | "pending";
  isVerified: boolean;
  isFeatured: boolean;
  rarity: "COMUN" | "RARO" | "EPICO" | "LEGENDARIO";
  rating: number;
  totalReviews: number;
  averagePrice: number | null;
  priceMin: number | null;
  priceMax: number | null;
  openHoursText: string | null;
  openingHours: { day: string; open: string; close: string }[] | null;
  metadata: Record<string, unknown> | null;
  amenities: Amenity[];
  tags: { id: string; name: string }[];
  views: number;
  googleReviews: GoogleReview[];
}

export interface GoogleReview {
  id: string;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string | null;
  relativeTimeDescription: string | null;
  time: number;
  createdAt: string;
}

export interface PlacesQuery {
  category?: string;
  district?: string;
  search?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  amenities?: string[];
  openNow?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  displayOrder: number;
  allergens: string[] | null;
  ingredients: string[] | null;
  isAvailable: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  dishes: Dish[];
}
