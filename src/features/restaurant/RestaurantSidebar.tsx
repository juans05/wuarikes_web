import Link from "next/link";
import { Clock, Globe, MapPin, Pencil, Phone } from "lucide-react";
import { OpenNowBadge } from "@/components/common/OpenNowBadge";
import type { Place } from "@/types/place";
import { SuggestEditButton } from "./SuggestEditButton";

export function RestaurantSidebar({ place }: { place: Place }) {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:h-fit">
      <Link
        href={`/restaurantes/${place.id}/editar`}
        className="flex items-center gap-2 rounded-2xl border border-dashed border-neutral-200 p-4 text-sm font-medium text-neutral-700 transition hover:border-primary hover:text-primary dark:border-neutral-800 dark:text-neutral-300"
      >
        <Pencil size={16} className="shrink-0" />
        Sugerir una edición para este perfil
      </Link>

      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 p-5 dark:border-neutral-800">
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Globe size={16} className="shrink-0" />
            <span className="truncate">{place.website.replace(/^https?:\/\//, "")}</span>
          </a>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          {place.phone ? (
            <a
              href={`tel:${place.phone}`}
              className="flex items-center gap-2 text-sm text-neutral-700 hover:underline dark:text-neutral-300"
            >
              <Phone size={16} className="shrink-0 text-neutral-400" />
              {place.phone}
            </a>
          ) : (
            <span className="flex items-center gap-2 text-sm text-neutral-400">
              <Phone size={16} className="shrink-0" />
              Todavía no hay teléfono.
            </span>
          )}
          <SuggestEditButton placeId={place.id} field="phone" />
        </div>

        {place.address && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 border-t border-neutral-100 pt-3 text-sm text-neutral-700 hover:underline dark:border-neutral-800 dark:text-neutral-300"
          >
            <MapPin size={16} className="mt-0.5 shrink-0 text-neutral-400" />
            <span>
              <span className="block font-medium text-primary">Cómo llegar</span>
              {place.address}
            </span>
          </a>
        )}

        <div className="flex items-start justify-between gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          {place.openHoursText || place.openingHours ? (
            <span className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <Clock size={16} className="mt-0.5 shrink-0 text-neutral-400" />
              <span className="flex flex-col gap-1">
                {place.openHoursText}
                <OpenNowBadge openHoursText={place.openHoursText} openingHours={place.openingHours} />
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm text-neutral-400">
              <Clock size={16} className="shrink-0" />
              Todavía no hay horario.
            </span>
          )}
          <SuggestEditButton placeId={place.id} field="hours" />
        </div>
      </div>

      {place.amenities.length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-neutral-100 p-5 dark:border-neutral-800">
          <h3 className="text-sm font-semibold">Servicios</h3>
          <div className="flex flex-wrap gap-2">
            {place.amenities.map((amenity) => (
              <span
                key={amenity.id}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {amenity.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
