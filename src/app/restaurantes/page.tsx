import type { Metadata } from "next";
import { RestaurantesView } from "@/features/restaurantes/RestaurantesView";

export const metadata: Metadata = {
  title: "Restaurantes",
  description: "Explora y filtra restaurantes, cafeterías y bares en Wuarikes.",
};

export default async function RestaurantesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoria?: string; rubro?: string | string[] }>;
}) {
  const { search, categoria, rubro } = await searchParams;

  return (
    <RestaurantesView
      initialSearch={search ?? ""}
      initialCategory={categoria ?? null}
      initialRubro={typeof rubro === "string" ? rubro : null}
    />
  );
}
