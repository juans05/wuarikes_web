import { Award, BadgeCheck, ChefHat } from "lucide-react";
import type { Place } from "@/types/place";

// Campos libres en `Place.metadata` (jsonb) — sin contrato estricto en el
// backend todavía, se leen si existen y la sección entera se oculta si no
// hay ninguno cargado.
interface ExtendedProfileMetadata {
  historia?: string;
  especialidades?: string;
  chef?: string;
  premios?: string[];
  certificaciones?: string[];
}

export function ExtendedProfileSection({ place }: { place: Place }) {
  const meta = (place.metadata ?? {}) as ExtendedProfileMetadata;
  const hasContent =
    meta.historia || meta.especialidades || meta.chef || meta.premios?.length || meta.certificaciones?.length;
  if (!hasContent) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Sobre el restaurante</h2>

      {meta.historia && (
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{meta.historia}</p>
      )}
      {meta.especialidades && (
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{meta.especialidades}</p>
      )}

      {meta.chef && (
        <div className="flex items-center gap-2 text-sm">
          <ChefHat size={16} className="shrink-0 text-neutral-400" />
          <span>{meta.chef}</span>
        </div>
      )}

      {meta.premios?.map((award) => (
        <div key={award} className="flex items-center gap-2 text-sm">
          <Award size={16} className="shrink-0 text-neutral-400" />
          <span>{award}</span>
        </div>
      ))}

      {meta.certificaciones?.map((cert) => (
        <div key={cert} className="flex items-center gap-2 text-sm">
          <BadgeCheck size={16} className="shrink-0 text-neutral-400" />
          <span>{cert}</span>
        </div>
      ))}
    </section>
  );
}
