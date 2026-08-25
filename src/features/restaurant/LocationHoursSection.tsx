"use client";

import dynamic from "next/dynamic";
import { Navigation } from "lucide-react";
import type { Place } from "@/types/place";
import { SuggestEditButton } from "./SuggestEditButton";

const MapView = dynamic(() => import("@/features/home/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />,
});

const DAY_LABELS: { key: string; label: string }[] = [
  { key: "mon", label: "Lunes" },
  { key: "tue", label: "Martes" },
  { key: "wed", label: "Miércoles" },
  { key: "thu", label: "Jueves" },
  { key: "fri", label: "Viernes" },
  { key: "sat", label: "Sábado" },
  { key: "sun", label: "Domingo" },
];

const JS_DAY_TO_KEY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function LocationHoursSection({ place }: { place: Place }) {
  const todayKey = JS_DAY_TO_KEY[new Date().getDay()];
  const hasStructuredHours = !!place.openingHours && place.openingHours.length > 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Ubicación y horario</h2>

      {place.latitude && place.longitude && (
        <div className="h-72 w-full overflow-hidden rounded-2xl border border-neutral-200 sm:h-96 dark:border-neutral-800">
          <MapView places={[place]} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3 rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
            {place.address ? (
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{place.address}</p>
            ) : (
              <p className="text-sm text-neutral-400">Todavía no hay dirección.</p>
            )}
            <div className="flex shrink-0 items-center gap-1">
              {place.address && place.latitude && place.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
                >
                  <Navigation size={13} />
                  Cómo llegar
                </a>
              )}
              <SuggestEditButton placeId={place.id} field="address" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
              Horario
            </span>
            <SuggestEditButton placeId={place.id} field="hours" />
          </div>

          {hasStructuredHours ? (
            <ul className="flex flex-col gap-1.5 text-sm">
              {DAY_LABELS.map(({ key, label }) => {
                const entry = place.openingHours?.find((h) => h.day === key);
                const isToday = key === todayKey;
                return (
                  <li
                    key={key}
                    className={
                      isToday
                        ? "flex items-center justify-between rounded-lg bg-primary/10 px-2 py-1 font-medium text-primary"
                        : "flex items-center justify-between px-2 py-1 text-neutral-600 dark:text-neutral-400"
                    }
                  >
                    <span>{label}</span>
                    <span>{entry ? `${entry.open} - ${entry.close}` : "Cerrado"}</span>
                  </li>
                );
              })}
            </ul>
          ) : place.openHoursText ? (
            <p className="text-sm text-neutral-700 dark:text-neutral-300">{place.openHoursText}</p>
          ) : (
            <p className="text-sm text-neutral-400">Todavía no hay horario.</p>
          )}
        </div>
      </div>
    </section>
  );
}
