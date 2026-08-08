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
          <Popup minWidth={220} maxWidth={240}>
            <div className="w-full">
              {place.coverImageUrl && (
                <div className="relative mb-2 h-28 w-full overflow-hidden rounded-lg bg-neutral-200">
                  <Image
                    src={place.coverImageUrl}
                    alt={place.name}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
              )}
              <p className="font-medium text-neutral-900">{place.name}</p>
              <p className="text-xs text-neutral-500">
                {place.category?.name}
                {place.district?.name ? ` · ${place.district.name}` : ""}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs">
                <RatingStars rating={place.rating} size={12} />
                <span className="text-neutral-500">
                  {place.rating.toFixed(1)} ({place.totalReviews})
                </span>
                {place.averagePrice != null && (
                  <span className="ml-auto font-medium text-primary">
                    S/ {place.averagePrice.toFixed(0)}
                  </span>
                )}
              </div>
              <a
                href={`/restaurantes/${place.id}`}
                className="mt-2 block rounded-lg bg-primary px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-primary-600"
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
