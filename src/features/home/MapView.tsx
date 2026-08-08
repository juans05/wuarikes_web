"use client";

import { useEffect } from "react";
import Image from "next/image";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { RatingStars } from "@/components/common/RatingStars";
import type { Place } from "@/types/place";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LIMA_CENTER: [number, number] = [-12.0464, -77.0428];

function RecenterOnPlaces({ places }: { places: Place[] }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;
    const bounds = L.latLngBounds(places.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [places, map]);

  return null;
}

export function MapView({
  places,
  onSelect,
}: {
  places: Place[];
  onSelect?: (place: Place) => void;
}) {
  return (
    <MapContainer
      center={LIMA_CENTER}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterOnPlaces places={places} />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]}
          icon={markerIcon}
          eventHandlers={{ click: () => onSelect?.(place) }}
        >
          <Popup minWidth={250} maxWidth={280}>
            <div className="w-full">
              <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
                {place.coverImageUrl && (
                  <Image
                    src={place.coverImageUrl}
                    alt={place.name}
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                )}
              </div>

              {(place.category || place.tags.length > 0) && (
                <div className="mb-1.5 flex flex-wrap gap-1">
                  {place.category && (
                    <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {place.category.name}
                    </span>
                  )}
                  {place.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-500"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="font-semibold text-neutral-900">{place.name}</p>

              {place.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
                  {place.description}
                </p>
              )}

              {place.address && (
                <p className="mt-1 line-clamp-1 text-[11px] text-neutral-400">{place.address}</p>
              )}

              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-[10px] tracking-wide text-neutral-400 uppercase">
                    Calificación
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs">
                    <RatingStars rating={place.rating} size={12} />
                    <span className="text-neutral-500">
                      {place.rating.toFixed(1)} ({place.totalReviews})
                    </span>
                  </div>
                </div>
                {place.averagePrice != null && (
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400">Desde</p>
                    <p className="text-sm font-semibold text-primary">
                      S/ {place.averagePrice.toFixed(0)}
                    </p>
                  </div>
                )}
              </div>

              <a
                href={`/restaurantes/${place.id}`}
                className="mt-2 block rounded-lg bg-primary px-3 py-2 text-center text-xs font-semibold text-white hover:bg-primary-600"
              >
                Ver más
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
