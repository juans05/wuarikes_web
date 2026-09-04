"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, MapPin } from "lucide-react";
import { useCreateCheckin, useAddDish } from "@/hooks/useCheckins";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function QuickCheckin({
  placeId,
  onCheckedIn,
}: {
  placeId: string;
  onCheckedIn?: () => void;
}) {
  const { mutate, isPending, isError, error, isSuccess, data } = useCreateCheckin(placeId);
  const addDish = useAddDish(placeId);
  const coordsRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");

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

  function handleSaveDish() {
    if (!data?.id || !dishName.trim()) return;
    addDish.mutate({
      checkinId: data.id,
      dishName: dishName.trim(),
      dishPrice: dishPrice ? Number(dishPrice) : undefined,
    });
  }

  if (isSuccess) {
    if (addDish.isSuccess) {
      return (
        <p className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-50 px-6 py-4 text-base font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-200">
          <CheckCircle2 size={22} />
          ¡Gracias! Ya sabemos qué pediste.
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-primary-50 p-4 dark:bg-primary-900/30">
        <p className="flex items-center gap-2 text-base font-bold text-primary-600 dark:text-primary-200">
          <CheckCircle2 size={22} />
          ¡Check-in registrado!
        </p>
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
          ¿Qué pediste? (opcional)
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="Ej. Lomo saltado"
            maxLength={100}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          <input
            type="number"
            min={0}
            value={dishPrice}
            onChange={(e) => setDishPrice(e.target.value)}
            placeholder="S/ precio"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm sm:w-28 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDish}
            disabled={!dishName.trim() || addDish.isPending}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
          >
            {addDish.isPending ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => onCheckedIn?.()}
            className="text-sm font-medium text-neutral-500 hover:underline"
          >
            Omitir
          </button>
        </div>
      </div>
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
