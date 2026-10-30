"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import { Skeleton } from "@/components/common/Skeleton";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";
import { useMyLoyaltyCards } from "@/hooks/useLoyalty";
import type { MyLoyaltyCard } from "@/services/loyalty.service";

export function LoyaltyWalletView() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const { data: cards, isLoading } = useMyLoyaltyCards();

  if (!isAuthenticated) {
    return (
      <EmptyState message="Inicia sesión para ver tus tarjetas de fidelización.">
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Iniciar sesión
        </button>
      </EmptyState>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-3 p-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <EmptyState message="Aún no tienes tarjetas de fidelización. Haz check-in con tu teléfono en un restaurante afiliado para empezar a acumular." />
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 p-4">
      <h1 className="text-lg font-bold">Mis fidelizaciones</h1>
      {cards.map((card) => (
        <LoyaltyCardItem key={card.placeId} card={card} />
      ))}
    </div>
  );
}

function LoyaltyCardItem({ card }: { card: MyLoyaltyCard }) {
  const progress =
    card.programType === "stamps" && card.stampsToReward
      ? (card.stamps % card.stampsToReward) / card.stampsToReward
      : null;

  return (
    <Link
      href={`/restaurantes/${card.placeId}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-neutral-900"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        {card.placeCoverImageUrl ? (
          <Image
            src={card.placeCoverImageUrl}
            alt={card.placeName}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <Gift size={20} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">{card.placeName}</p>
          <span className="shrink-0 rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-medium text-secondary">
            {card.level}
          </span>
        </div>

        {card.programType === "stamps" ? (
          <>
            <p className="mt-0.5 text-xs text-neutral-500">
              {card.stampsRemaining} sello{card.stampsRemaining === 1 ? "" : "s"} para{" "}
              {card.rewardTitle}
            </p>
            {progress != null && (
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-secondary"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            )}
          </>
        ) : (
          <p className="mt-0.5 text-xs text-neutral-500">
            {card.points} puntos · {card.rewardTitle}
          </p>
        )}
      </div>
    </Link>
  );
}

function EmptyState({ message, children }: { message: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <Gift size={32} className="text-neutral-300" />
      <p className="max-w-sm text-sm text-neutral-500">{message}</p>
      {children}
    </div>
  );
}
