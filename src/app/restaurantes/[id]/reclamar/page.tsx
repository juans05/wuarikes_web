import type { Metadata } from "next";
import { ClaimPlaceForm } from "@/features/places/ClaimPlaceForm";

export const metadata: Metadata = {
  title: "Reclama tu negocio",
};

export default async function ReclamarRestaurantePage({
  params,
}: PageProps<"/restaurantes/[id]/reclamar">) {
  const { id } = await params;
  return <ClaimPlaceForm id={id} />;
}
