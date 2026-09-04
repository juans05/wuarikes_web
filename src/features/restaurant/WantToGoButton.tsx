"use client";

import { Flag } from "lucide-react";
import clsx from "clsx";
import { useInterest } from "@/hooks/useInterest";
import { useAuthModalStore } from "@/stores/authModal.store";

export function WantToGoButton({ placeId }: { placeId: string }) {
  const openAuthModal = useAuthModalStore((s) => s.open);
  const { isInterested, isAuthenticated, toggle, isPending } = useInterest(placeId);

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
      title={isAuthenticated ? "Quiero ir" : "Inicia sesión para marcar que quieres ir"}
      aria-label={isInterested ? "Quitar de \"quiero ir\"" : "Marcar \"quiero ir\""}
      aria-pressed={isInterested}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-800 dark:hover:bg-neutral-700"
    >
      <Flag
        size={18}
        className={clsx(isInterested ? "fill-primary text-primary" : "text-neutral-500")}
      />
    </button>
  );
}
