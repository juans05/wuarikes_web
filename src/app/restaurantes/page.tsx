import type { Metadata } from "next";
import { RestaurantesView } from "@/features/restaurantes/RestaurantesView";

export const metadata: Metadata = {
  title: "Restaurantes",
  description: "Explora y filtra restaurantes, cafeterías y bares en Wuarikes.",
};

type Param = string | string[] | undefined;
const one = (v: Param) => (typeof v === "string" ? v : undefined);
const num = (v: Param) => {
  const n = Number(one(v));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export default async function RestaurantesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, Param>>;
}) {
  const sp = await searchParams;

  return (
    <RestaurantesView
      initialSearch={one(sp.search) ?? ""}
      initialCategory={one(sp.categoria) ?? null}
      initialRubro={one(sp.rubro) ?? null}
      initialDistrict={one(sp.distrito) ?? null}
      // Atajos de la portada (Abierto ahora, Hasta S/ 30, …).
      initialFilters={{
        amenities: [],
        openNow: sp.abierto === "1",
        hasLoyalty: sp.promo === "1",
        priceMax: num(sp.hasta),
        minRating: num(sp.rating),
      }}
    />
  );
}
