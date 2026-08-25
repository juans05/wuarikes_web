"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useSubmitInfoSuggestion } from "@/hooks/useInfoCheck";
import type { PlaceInfoField } from "@/services/infoCheck.service";
import type { Place } from "@/types/place";

type Question = {
  field: PlaceInfoField;
  label: string;
  /** true si el campo se puede corregir con un input; el field "menu" solo se reporta. */
  editable: boolean;
  currentValue: string | null;
};

/**
 * Se muestra después de un check-in para pedir al usuario que confirme si la
 * info del local sigue vigente. Un "no" registra un voto de corrección; al
 * tercer usuario que coincide en el mismo valor, el backend lo aplica solo
 * (ver CheckinsService.submitInfoSuggestion).
 */
export function InfoCheckPrompt({ place }: { place: Place }) {
  const questions: Question[] = [
    { field: "phone", label: "¿El teléfono sigue siendo correcto?", editable: true, currentValue: place.phone },
    { field: "address", label: "¿La dirección sigue siendo correcta?", editable: true, currentValue: place.address },
    { field: "menu", label: "¿La carta y los precios siguen igual?", editable: false, currentValue: null },
  ];

  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || step >= questions.length) return null;

  const question = questions[step];

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">Ayúdanos a mantener este Huarique actualizado</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Omitir"
          className="shrink-0 text-neutral-400 hover:text-neutral-600"
        >
          <X size={16} />
        </button>
      </div>
      <QuestionCard
        placeId={place.id}
        question={question}
        onAnswered={() => setStep((s) => s + 1)}
      />
    </div>
  );
}

function QuestionCard({
  placeId,
  question,
  onAnswered,
}: {
  placeId: string;
  question: Question;
  onAnswered: () => void;
}) {
  const [correcting, setCorrecting] = useState(false);
  const [value, setValue] = useState(question.currentValue ?? "");
  const [done, setDone] = useState(false);
  const mutation = useSubmitInfoSuggestion();

  function reportOutdated(suggestedValue?: string) {
    mutation.mutate(
      { placeId, field: question.field, suggestedValue },
      { onSuccess: () => setDone(true) },
    );
  }

  if (done) {
    return (
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">Gracias, lo tendremos en cuenta.</p>
        <button
          type="button"
          onClick={onAnswered}
          className="shrink-0 text-xs font-medium text-primary hover:underline"
        >
          Continuar
        </button>
      </div>
    );
  }

  if (correcting) {
    return (
      <div className="flex flex-col gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Nuevo ${question.field === "phone" ? "teléfono" : "dirección"}`}
          className="rounded-xl border border-neutral-200 bg-white p-2.5 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-950"
        />
        <button
          type="button"
          disabled={!value.trim() || mutation.isPending}
          onClick={() => reportOutdated(value.trim())}
          className="self-start rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          Enviar corrección
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-neutral-700 dark:text-neutral-300">{question.label}</span>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onAnswered}
          aria-label="Sí"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300"
        >
          <Check size={14} />
        </button>
        <button
          type="button"
          onClick={() => (question.editable ? setCorrecting(true) : reportOutdated())}
          aria-label="No"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
