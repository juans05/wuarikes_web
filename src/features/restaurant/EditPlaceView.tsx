"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { usePlace, useAmenities, useCategories } from "@/hooks/usePlaces";
import { useSubmitInfoSuggestion } from "@/hooks/useInfoCheck";
import type { PlaceInfoField } from "@/services/infoCheck.service";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";
import { WeeklyHoursEditor, type DayHours } from "./WeeklyHoursEditor";
import { Skeleton } from "@/components/common/Skeleton";

export function EditPlaceView({ id }: { id: string }) {
  const { data: place, isLoading } = usePlace(id);
  const { data: categories } = useCategories();
  const { data: amenities } = useAmenities();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const suggest = useSubmitInfoSuggestion();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amenityIds, setAmenityIds] = useState<Set<string>>(new Set());
  const [hours, setHours] = useState<DayHours[]>([]);
  const [submittedCount, setSubmittedCount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!place) return;
    setName(place.name ?? "");
    setPhone(place.phone ?? "");
    setWebsite(place.website ?? "");
    setAddress(place.address ?? "");
    setCategoryId(place.category?.id ?? "");
    setAmenityIds(new Set(place.amenities.map((a) => a.id)));
    setHours(place.openingHours ?? []);
  }, [place]);

  function toggleAmenity(id: string) {
    setAmenityIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!place) return;
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    const changes: { field: PlaceInfoField; suggestedValue?: string }[] = [];
    if (name.trim() && name.trim() !== place.name) changes.push({ field: "name", suggestedValue: name.trim() });
    if (phone.trim() !== (place.phone ?? "")) changes.push({ field: "phone", suggestedValue: phone.trim() });
    if (website.trim() !== (place.website ?? "")) changes.push({ field: "website", suggestedValue: website.trim() });
    if (address.trim() !== (place.address ?? "")) changes.push({ field: "address", suggestedValue: address.trim() });

    const originalCategorySlug = place.category?.id ?? "";
    if (categoryId && categoryId !== originalCategorySlug) {
      const category = categories?.find((c) => c.id === categoryId);
      if (category) changes.push({ field: "category", suggestedValue: category.slug });
    }

    const originalAmenityIds = new Set(place.amenities.map((a) => a.id));
    const sameAmenities =
      amenityIds.size === originalAmenityIds.size &&
      [...amenityIds].every((id) => originalAmenityIds.has(id));
    if (!sameAmenities) {
      const slugs = amenities?.filter((a) => amenityIds.has(a.id)).map((a) => a.slug) ?? [];
      changes.push({ field: "amenities", suggestedValue: slugs.join(",") });
    }

    const originalHours = JSON.stringify(place.openingHours ?? []);
    if (JSON.stringify(hours) !== originalHours && hours.length > 0) {
      changes.push({ field: "hours", suggestedValue: JSON.stringify(hours) });
    }

    if (changes.length === 0) {
      setSubmittedCount(0);
      return;
    }

    setSubmitting(true);
    for (const change of changes) {
      await suggest.mutateAsync({ placeId: id, field: change.field, suggestedValue: change.suggestedValue });
    }
    setSubmitting(false);
    setSubmittedCount(changes.length);
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (!place) {
    return <p className="p-8 text-center text-sm text-red-500">No se pudo cargar este restaurante.</p>;
  }

  if (submittedCount !== null) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 p-8 text-center">
        <h1 className="font-heading text-2xl font-bold">¡Gracias por tu aporte!</h1>
        <p className="text-sm text-neutral-500">
          {submittedCount === 0
            ? "No detectamos cambios respecto a la información actual."
            : `Enviamos ${submittedCount} sugerencia${submittedCount > 1 ? "s" : ""} de cambio. Se aplican automáticamente cuando otros usuarios coinciden en lo mismo.`}
        </p>
        <Link
          href={`/restaurantes/${id}`}
          className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600"
        >
          Volver al restaurante
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-8 p-4 pb-24">
      <div className="flex items-center gap-3">
        <Link
          href={`/restaurantes/${id}`}
          aria-label="Volver"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading text-2xl font-bold">Mejorar este perfil</h1>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-4 dark:border-neutral-800">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
          {place.coverImageUrl && (
            <Image src={place.coverImageUrl} alt={place.name} fill className="object-cover" />
          )}
        </div>
        <div>
          <span className="text-xs text-neutral-400">Restaurante</span>
          <p className="font-heading text-lg font-semibold">{place.name}</p>
        </div>
      </div>

      {!isAuthenticated && (
        <p className="rounded-xl bg-neutral-100 p-3 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          Necesitas iniciar sesión para enviar cambios.{" "}
          <button type="button" onClick={() => openAuthModal("login")} className="font-medium text-primary hover:underline">
            Iniciar sesión
          </button>
        </p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Información general</h2>
        <Field label="Nombre del lugar">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Teléfono (opcional)">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Sitio web (opcional)">
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} />
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Ubicación</h2>
        <Field label="Dirección (opcional)">
          <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
        </Field>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Horario de atención</h2>
        <WeeklyHoursEditor value={hours} onChange={setHours} />
      </section>

      {categories && categories.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Categoría</h2>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </section>
      )}

      {amenities && amenities.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">¿Qué servicios ofrece este restaurante?</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {amenities.map((a) => (
              <label key={a.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={amenityIds.has(a.id)}
                  onChange={() => toggleAmenity(a.id)}
                  className="h-4 w-4 accent-primary"
                />
                {a.name}
              </label>
            ))}
          </div>
        </section>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? "Enviando..." : "Enviar cambios"}
      </button>
    </form>
  );
}

const inputClass =
  "rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-950";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-neutral-500">{label}</label>
      {children}
    </div>
  );
}
