"use client";

import { PenLine } from "lucide-react";
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {isAuthenticated ? (
          <QuickCheckin placeId={placeId} onCheckedIn={onCheckedIn} />
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-white shadow-md shadow-primary-500/40 transition hover:bg-primary-600"
          >
            Inicia sesión para hacer check-in
          </button>
        )}

        <button
          type="button"
          onClick={() => scrollTo("resenas")}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-white shadow-md shadow-primary-500/40 transition hover:bg-primary-600"
        >
          <PenLine size={17} />
          Escribir reseña
        </button>

        <WantToGoButton placeId={placeId} />
      </div>

      <div className="flex items-center gap-2">
        <FavoriteButton placeId={placeId} />
        <ShareButtons title={placeName} />
      </div>
    </div>
  );
}
