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

// Botón chico con texto para las secciones de la ficha (carta, fotos): visible sin gritar.
export const ACTION_PILL =
  "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200 transition hover:text-primary hover:ring-primary/50 disabled:opacity-60 dark:text-neutral-300 dark:ring-neutral-700";

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
