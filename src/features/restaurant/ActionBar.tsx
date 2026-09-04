"use client";

import { Camera, PenLine } from "lucide-react";
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
      {isAuthenticated ? (
        <QuickCheckin placeId={placeId} onCheckedIn={onCheckedIn} />
      ) : (
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600 sm:w-fit sm:px-8"
        >
          Inicia sesión para hacer check-in
        </button>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => scrollTo("resenas")}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-600"
        >
          <PenLine size={15} />
          Escribir reseña
        </button>

        <button
          type="button"
          onClick={() => scrollTo("galeria")}
          className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          <Camera size={15} />
          Fotos y videos
        </button>

        <div className="ml-auto flex items-center gap-2">
          <FavoriteButton placeId={placeId} />
          <WantToGoButton placeId={placeId} />
          <ShareButtons title={placeName} />
        </div>
      </div>
    </div>
  );
}
