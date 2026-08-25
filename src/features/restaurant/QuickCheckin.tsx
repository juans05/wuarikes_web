"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, MapPin } from "lucide-react";
import { useCreateCheckin } from "@/hooks/useCheckins";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function QuickCheckin({
  placeId,
  onCheckedIn,
}: {
  placeId: string;
  onCheckedIn?: () => void;
}) {
  const { mutate, isPending, isError, error, isSuccess } = useCreateCheckin(placeId);
  const coordsRef = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      coordsRef.current = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    });
  }, []);

  function handleCheckin() {
    mutate(
      {
        placeId,
        latitude: coordsRef.current?.latitude,
        longitude: coordsRef.current?.longitude,
      },
      { onSuccess: () => onCheckedIn?.() },
    );
  }

  if (isSuccess) {
    return (
      <p className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-50 px-6 py-4 text-base font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-200">
        <CheckCircle2 size={22} />
        ¡Check-in registrado!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleCheckin}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-white shadow-lg shadow-primary-500/30 transition hover:scale-[1.01] hover:bg-primary-600 active:scale-100 disabled:opacity-50 sm:w-fit sm:px-8"
      >
        <MapPin size={22} />
        {isPending ? "Registrando..." : "Hacer Check-in aquí"}
      </button>
      {isError && (
        <p className="text-xs text-red-500">
          {getErrorMessage(error, "No se pudo registrar el check-in. Intenta de nuevo.")}
        </p>
      )}
    </div>
  );
}
