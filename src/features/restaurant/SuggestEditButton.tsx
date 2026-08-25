import Link from "next/link";
import { Pencil } from "lucide-react";
import type { PlaceInfoField } from "@/services/infoCheck.service";

const FIELD_LABELS: Record<PlaceInfoField, string> = {
  phone: "el teléfono",
  address: "la dirección",
  hours: "el horario",
  menu: "la carta",
  name: "el nombre",
  website: "el sitio web",
  category: "la categoría",
  amenities: "los servicios",
};

/** Lapicito "sugerir o editar" — lleva a la pantalla completa de edición del local. */
export function SuggestEditButton({ placeId, field }: { placeId: string; field: PlaceInfoField }) {
  return (
    <Link
      href={`/restaurantes/${placeId}/editar`}
      aria-label={`Sugerir ${FIELD_LABELS[field]}`}
      title={`Sugerir ${FIELD_LABELS[field]}`}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-primary dark:hover:bg-neutral-800"
    >
      <Pencil size={13} />
    </Link>
  );
}
