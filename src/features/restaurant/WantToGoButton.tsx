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
      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-white shadow-md shadow-primary-500/40 transition hover:bg-primary-600 disabled:opacity-60"
    >
      <Flag size={17} className={clsx(isInterested && "fill-white")} />
      {isInterested ? "¡Quiero ir!" : "Quiero ir"}
    </button>
  );
}
