"use client";

import {
  Car,
  LayoutGrid,
  PawPrint,
  Scissors,
  ShoppingBag,
  Stethoscope,
  Store,
  Ticket,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useBusinessTypes } from "@/hooks/usePlaces";
import { DEFAULT_VERTICAL } from "@/services/places.service";

// Solo presentación: qué rubros existen y cómo se llaman lo dicta el backend.
// Un rubro nuevo sin ícono acá usa Store.
const ICONS_BY_VERTICAL: Record<string, LucideIcon> = {
  gastronomia: UtensilsCrossed,
  comercio: ShoppingBag,
  belleza: Scissors,
  salud: Stethoscope,
  mascotas: PawPrint,
  automotriz: Car,
  servicios: Wrench,
  entretenimiento: Ticket,
};

// value: undefined = gastronomía (por defecto), 'all' = todos, o la clave de un rubro.
// className va en el contenedor de los chips: así el espaciado del llamador (márgenes, ancho)
// desaparece junto con ellos cuando no hay rubros que mostrar.
export function VerticalChips({
  value,
  onChange,
  className = "",
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
}) {
  const { data } = useBusinessTypes();
  // Sin lista (cargando, o backend anterior al multirrubro) no hay nada que filtrar.
  if (!data || data.verticals.length === 0) return null;

  const current = value ?? DEFAULT_VERTICAL;
  const chips = [
    ...data.verticals.map((v) => ({
      key: v.key,
      label: v.label,
      Icon: ICONS_BY_VERTICAL[v.key] ?? Store,
    })),
    { key: "all", label: "Todos", Icon: LayoutGrid },
  ];

  return (
    <div
      role="group"
      aria-label="Rubro"
      className={`flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] ${className}`}
    >
      {chips.map(({ key, label, Icon }) => {
        const active = current === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key === DEFAULT_VERTICAL ? undefined : key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-primary text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
