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
function normalizePlace(raw: Place): Place {
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
  const { data } = await apiClient.get<PaginatedResponse<Place>>("/places", {
    params: { ...query, amenities: query.amenities?.join(",") },
  });
  return { ...data, data: data.data.map(normalizePlace) };
}

export async function getPlace(id: string) {
  const { data } = await apiClient.get<Place>(`/places/${id}`);
  return normalizePlace(data);
}

export async function getPlaceMenu(id: string) {
  const { data } = await apiClient.get<{ categories: MenuCategory[] }>(
    `/places/${id}/menu`,
  );
  return data.categories.map((category) => ({
    ...category,
    dishes: category.dishes.map((dish) => ({
      ...dish,
      price: Number(dish.price),
    })),
  }));
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
}

export async function submitPlace(input: SubmitPlaceInput) {
  const { data } = await apiClient.post<{ id: string }>("/places/submit", input);
  return data;
}
