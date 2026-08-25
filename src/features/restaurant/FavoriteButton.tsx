"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";
import { useFavorite } from "@/hooks/useFavorite";
import { useAuthModalStore } from "@/stores/authModal.store";

export function FavoriteButton({ placeId }: { placeId: string }) {
  const openAuthModal = useAuthModalStore((s) => s.open);
  const { isFavorite, isAuthenticated, toggle, isPending } = useFavorite(placeId);

  function handleClick() {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    toggle();
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      title={isAuthenticated ? "Guardar en favoritos" : "Inicia sesión para guardar"}
      aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
      aria-pressed={isFavorite}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-800 dark:hover:bg-neutral-700"
    >
      <Heart
        size={18}
        className={clsx(isFavorite ? "fill-red-500 text-red-500" : "text-neutral-500")}
      />
    </button>
  );
}
