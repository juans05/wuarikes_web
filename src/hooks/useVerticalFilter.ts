"use client";

import { useState } from "react";
import { useBusinessTypes } from "@/hooks/usePlaces";
import { DEFAULT_VERTICAL } from "@/services/places.service";

// Rubro elegido en el mapa/portada, sincronizado con `?rubro=` para poder compartir el enlace.
// `undefined` = sin parámetro = gastronomía (lo que devuelve el backend por defecto); 'all' = todos.
// Un valor que el backend no conoce se ignora (cae a gastronomía). Mientras la lista de rubros
// no llega se confía en el valor de la URL, así un enlace válido hace una sola consulta.
export function useVerticalFilter(initial?: string | null) {
  const { data } = useBusinessTypes();
  const [raw, setRaw] = useState<string | undefined>(initial || undefined);

  const unknown =
    raw !== undefined && raw !== "all" && data && !data.verticals.some((v) => v.key === raw);
  const vertical = unknown ? undefined : raw;

  function setVertical(next?: string) {
    setRaw(next);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("rubro", next);
    else url.searchParams.delete("rubro");
    window.history.replaceState(null, "", url);
  }

  return {
    vertical,
    setVertical,
    // La consulta "¿dónde comemos?" y otros textos de comida solo aplican a gastronomía.
    isFood: vertical === undefined || vertical === DEFAULT_VERTICAL,
  };
}

// Sufijo para propagar el rubro en enlaces internos a /restaurantes.
export function rubroQuery(vertical?: string) {
  return vertical ? `&rubro=${encodeURIComponent(vertical)}` : "";
}
