import type { Metadata } from "next";
import { EditPlaceView } from "@/features/restaurant/EditPlaceView";

export const metadata: Metadata = {
  title: "Sugerir una edición",
};

export default async function EditarRestaurantePage({
  params,
}: PageProps<"/restaurantes/[id]/editar">) {
  const { id } = await params;
  return <EditPlaceView id={id} />;
}
