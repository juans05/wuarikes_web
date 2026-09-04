"use client";

import { useState } from "react";
import { RefreshCw, MapPin, Sparkles } from "lucide-react";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { PlaceCardSkeleton } from "@/components/common/Skeleton";
import { useCategories, useRecommendations } from "@/hooks/usePlaces";
import type { PlacesQuery } from "@/types/place";

interface Budget {
  label: string;
  priceMin?: number;
  priceMax?: number;
}

const BUDGETS: Budget[] = [
  { label: "Menos de S/20", priceMax: 20 },
  { label: "S/20 – S/30", priceMin: 20, priceMax: 30 },
  { label: "S/30 – S/50", priceMin: 30, priceMax: 50 },
  { label: "Más de S/50", priceMin: 50 },
];

type Step = "category" | "budget" | "location" | "results";

export function WhereToEatWizard() {
  const { data: categories } = useCategories();
  const [step, setStep] = useState<Step>("category");
  const [category, setCategory] = useState<string | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const query: PlacesQuery = {
    category: category ?? undefined,
    priceMin: budget?.priceMin,
    priceMax: budget?.priceMax,
    latitude: coords?.latitude,
    longitude: coords?.longitude,
    radius: coords ? 5 : undefined,
  };

  // El backend sortea 3 entre los mejor calificados en cada llamada, así que
  // refetch() alcanza para traer opciones distintas — no hace falta un query
  // key artificial.
  const { data: results, isLoading, refetch } = useRecommendations(query, step === "results");

  function handleUseLocation() {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStep("results");
      },
      () => setStep("results"),
    );
  }

  function reset() {
    setStep("category");
    setCategory(null);
    setBudget(null);
    setCoords(null);
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-primary-50 to-white p-6 dark:border-neutral-800 dark:from-primary-950/40 dark:to-neutral-900 sm:p-8">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles size={20} className="text-primary" />
        <h2 className="font-heading text-xl font-bold text-neutral-900 dark:text-neutral-50">
          ¿Dónde comemos hoy?
        </h2>
      </div>

      {step === "category" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            ¿Qué se te antoja?
          </p>
          <div className="flex flex-wrap gap-2">
            {(categories ?? []).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategory(c.slug);
                  setStep("budget");
                }}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-primary hover:text-primary dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              >
                {c.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setStep("budget")}
              className="rounded-full border border-dashed border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-500 hover:border-primary hover:text-primary dark:border-neutral-700"
            >
              Sorpréndeme
            </button>
          </div>
        </div>
      )}

      {step === "budget" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            ¿Cuánto quieres gastar?
          </p>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => {
                  setBudget(b);
                  setStep("location");
                }}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-primary hover:text-primary dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "location" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            ¿Dónde estás?
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleUseLocation}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600"
            >
              <MapPin size={16} />
              Usar mi ubicación
            </button>
            <button
              type="button"
              onClick={() => setStep("results")}
              className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
            >
              Cualquier lugar
            </button>
          </div>
        </div>
      )}

      {step === "results" && (
        <div className="flex flex-col gap-4">
          {isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && results && results.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {results.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}

          {!isLoading && results && results.length === 0 && (
            <p className="py-6 text-center text-sm text-neutral-500">
              No encontramos lugares con esos filtros. Intenta con otro presupuesto o tipo de comida.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200"
            >
              <RefreshCw size={15} />
              Otras opciones
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-neutral-500 hover:underline"
            >
              Empezar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
