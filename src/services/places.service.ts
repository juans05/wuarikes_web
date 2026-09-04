import { apiClient } from "@/api/client";
import type {
  Amenity,
  Category,
  MenuCategory,
  PaginatedResponse,
  Place,
  PlacesQuery,
} from "@/types/place";

// Para negocios cargados desde datos legados, el backend a veces serializa
// `amenities`/`tags` como string[] plano en vez del objeto {id, name, ...}
// que declara el tipo Place — eso rompía el `key={amenity.id}` en
// RestaurantView (id quedaba undefined). Se normaliza acá, en el único
// punto por el que pasan getPlace/getPlaces, para que ningún consumidor
// tenga que volver a lidiar con las dos formas.
function normalizeNamedList<T extends { id: string; name: string }>(
  list: unknown,
  toItem: (name: string) => T,
): T[] {
  if (!Array.isArray(list)) return [];
  return list.map((item) => (typeof item === "string" ? toItem(item) : (item as T)));
}

// El backend usa columnas `decimal` en Postgres, que TypeORM serializa como string.
export function normalizePlace(raw: Place): Place {
  return {
    ...raw,
    rating: Number(raw.rating),
    latitude: Number(raw.latitude),
    longitude: Number(raw.longitude),
    averagePrice: raw.averagePrice != null ? Number(raw.averagePrice) : null,
    priceMin: raw.priceMin != null ? Number(raw.priceMin) : null,
    priceMax: raw.priceMax != null ? Number(raw.priceMax) : null,
    amenities: normalizeNamedList<Amenity>(raw.amenities, (name) => ({
      id: name,
      name,
      slug: name,
      iconUrl: "",
    })),
    tags: normalizeNamedList<Place["tags"][number]>(raw.tags, (name) => ({
      id: name,
      name,
    })),
  };
}

export async function getPlaces(query: PlacesQuery) {
  // GET /places responde { data, meta: { total, page, size } } (distinto del
  // resto de endpoints paginados, que devuelven total/page/limit planos).
  // Se normaliza acá para que PaginatedResponse<Place> sea siempre plano.
  const { data } = await apiClient.get<{
    data: Place[];
    meta: { total: number; page: number; size: number };
  }>("/places", {
    params: { ...query, amenities: query.amenities?.join(",") },
  });
  return {
    data: data.data.map(normalizePlace),
    total: data.meta.total,
    page: data.meta.page,
    limit: data.meta.size,
  } satisfies PaginatedResponse<Place>;
}

export async function getPlace(id: string) {
  const { data } = await apiClient.get<Place>(`/places/${id}`);
  return normalizePlace(data);
}

export async function getPlaceMenu(id: string) {
  const { data } = await apiClient.get<{
    place: { menuImageUrls: string[] | null };
    categories: MenuCategory[];
  }>(`/places/${id}/menu`);
  return {
    menuImageUrls: data.place.menuImageUrls ?? [],
    categories: data.categories.map((category) => ({
      ...category,
      dishes: category.dishes.map((dish) => ({
        ...dish,
        price: Number(dish.price),
      })),
    })),
  };
}

export interface RatingDistributionEntry {
  rating: number;
  count: number;
}

export async function getRatingDistribution(id: string) {
  const { data } = await apiClient.get<RatingDistributionEntry[]>(
    `/places/${id}/rating-distribution`,
  );
  return data;
}

export interface TikTokVideo {
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
  authorName: string | null;
}

export interface TikTokSearchResult {
  videos: TikTokVideo[];
  available: boolean;
}

// Revisa metadata.tiktokVideos en la DB primero; si no hay nada cacheado,
// el backend busca en TikTok en caliente (puede tardar bastante) y lo
// guarda para la próxima vez. `available: false` = el scraper no está
// disponible en este entorno (p.ej. producción sin Python instalado).
export async function searchTikTok(id: string) {
  const { data } = await apiClient.post<TikTokSearchResult>(`/places/${id}/tiktok-search`);
  return data;
}

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
}

export async function getPromotions(id: string) {
  const { data } = await apiClient.get<Promotion[]>(`/places/${id}/promotions`);
  return data;
}

export async function getCategories() {
  const { data } = await apiClient.get<Category[]>("/places/categories");
  return data;
}

export async function getAmenities() {
  const { data } = await apiClient.get<Amenity[]>("/places/amenities");
  return data;
}

export interface SubmitPlaceInput {
  name: string;
  description?: string;
  categoryId: string;
  district: string;
  address?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  coverImageUrl?: string;
  photoUrls?: string[];
  openHoursText?: string;
  menuImageUrls?: string[];
  videoUrl?: string;
}

export async function submitPlace(input: SubmitPlaceInput) {
  const { data } = await apiClient.post<{ id: string }>("/places/submit", input);
  return data;
}

export interface ClaimPlaceInput {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  whatsapp?: string;
  documentUrls?: string[];
}

export async function claimPlace(placeId: string, input: ClaimPlaceInput) {
  const { data } = await apiClient.post<{ id: string }>(`/places/${placeId}/claim`, input);
  return data;
}

export async function getTrending(district?: string, category?: string, limit = 10) {
  const { data } = await apiClient.get<Place[]>("/places/discovery/different", {
    params: { district, category, limit },
  });
  return data.map(normalizePlace);
}

export async function getMostFavorited(limit = 10) {
  const { data } = await apiClient.get<Place[]>("/places/discovery/most-favorited", {
    params: { limit },
  });
  return data.map(normalizePlace);
}

export async function getRecommendations(query: PlacesQuery) {
  const { data } = await apiClient.get<Place[]>("/places/recommendations", { params: query });
  return data.map(normalizePlace);
}

export interface TrustStage {
  stage: "comunidad" | "verificado" | "reclamado" | "negocio_wuarike";
  label: string;
}

export async function getTrustStage(placeId: string) {
  const { data } = await apiClient.get<TrustStage>(`/places/${placeId}/trust-stage`);
  return data;
}

export interface FriendsVisited {
  count: number;
  friends: { id: string; fullName: string; avatarUrl: string | null }[];
}

export async function getFriendsVisited(placeId: string) {
  const { data } = await apiClient.get<FriendsVisited>(`/places/${placeId}/friends-visited`);
  return data;
}

export interface SubmitWuarikesHereInput {
  restaurantName: string;
  address?: string;
  district?: string;
  notes?: string;
}

export async function submitWuarikesHere(input: SubmitWuarikesHereInput) {
  const { data } = await apiClient.post<{ message: string }>("/places/wuarikes-here", input);
  return data;
}
