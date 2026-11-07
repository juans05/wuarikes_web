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
      aria-label={isInterested ? "Quitar de \"quiero ir\"" : "Marcar \"quiero ir\""}
      aria-pressed={isInterested}
      className={clsx(
        "flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium ring-1 transition disabled:opacity-60",
        isInterested
          ? "bg-primary-50 text-primary-700 ring-primary/40 dark:bg-primary-900/30 dark:text-primary-200"
          : "text-neutral-700 ring-neutral-200 hover:text-primary hover:ring-primary/60 dark:text-neutral-200 dark:ring-neutral-700",
      )}
    >
      <Flag size={15} className={clsx(isInterested && "fill-current")} />
      {isInterested ? "¡Quiero ir!" : "Quiero ir"}
    </button>
  );
}
