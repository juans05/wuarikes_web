"use client";

import { CalendarDays, MapPin, MessageCircle, PenLine } from "lucide-react";
import { usePlaceActions } from "@/hooks/usePlaces";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";
import { FavoriteButton } from "./FavoriteButton";
import { WantToGoButton } from "./WantToGoButton";
import { ShareButtons } from "./ShareButtons";
import { QuickCheckin } from "./QuickCheckin";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ActionBar({
  placeId,
  placeName,
  onCheckedIn,
}: {
  placeId: string;
  placeName: string;
  onCheckedIn?: () => void;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const { data } = usePlaceActions(placeId);
  // Defensa extra: solo enlaces http(s) aunque el backend arme la URL.
  const actions = data && { ...data, bookingUrl: /^https?:\/\//i.test(data.bookingUrl ?? "") ? data.bookingUrl : null };
  const orderText = encodeURIComponent(`Hola, quiero hacer un pedido en ${placeName} (vi su ficha en Wuarikes).`);

  return (
    <div className="flex flex-col gap-3">
      {(actions?.bookingUrl || actions?.orderWhatsapp) && (
        <div className="flex flex-col gap-2">
          {actions.bookingUrl && (
            <a
              href={actions.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
            >
              <CalendarDays size={18} />
              Reservar cita
            </a>
          )}
          {actions.orderWhatsapp && (
            <a
              href={`https://wa.me/${actions.orderWhatsapp}?text=${orderText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0E7A3E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B6533]"
            >
              <MessageCircle size={18} />
              Pedir por WhatsApp
            </a>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {isAuthenticated ? (
          <QuickCheckin placeId={placeId} onCheckedIn={onCheckedIn} />
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            <MapPin size={15} />
            Inicia sesión y haz check-in
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => scrollTo("resenas")}
            className="flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200 transition hover:text-primary hover:ring-primary/60 dark:text-neutral-200 dark:ring-neutral-700"
          >
            <PenLine size={15} />
            Escribir reseña
          </button>
          <WantToGoButton placeId={placeId} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <FavoriteButton placeId={placeId} />
        <ShareButtons title={placeName} />
      </div>
    </div>
  );
}
