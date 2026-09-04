"use client";

import { ShieldCheck, Users, Store, Award } from "lucide-react";
import { useTrustStage } from "@/hooks/usePlaces";

const ICONS = {
  comunidad: Users,
  verificado: ShieldCheck,
  reclamado: Store,
  negocio_wuarike: Award,
};

export function TrustBadge({ placeId }: { placeId: string }) {
  const { data } = useTrustStage(placeId);
  if (!data) return null;

  const Icon = ICONS[data.stage];

  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
      <Icon size={13} />
      {data.label}
    </span>
  );
}
