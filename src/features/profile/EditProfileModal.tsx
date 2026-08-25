"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { UserProfile } from "@/types/user";

const GENDER_OPTIONS = ["Masculino", "Femenino", "No binario"];
const PRONOUN_OPTIONS = ["Él/He", "Ella/She", "Elle/They"];

const schema = z.object({
  fullName: z.string().min(1, "El nombre no puede estar vacío").max(100),
  bio: z.string().max(500, "Máximo 500 caracteres").optional(),
  city: z.string().max(100).optional(),
  hometown: z.string().max(100).optional(),
  gender: z.string().optional(),
  pronouns: z.string().optional(),
  birthDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function EditProfileModal({
  profile,
  onClose,
}: {
  profile: UserProfile;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile.fullName,
      bio: profile.bio ?? "",
      city: profile.city ?? "",
      hometown: profile.hometown ?? "",
      gender: profile.gender ?? "",
      pronouns: profile.pronouns ?? "",
      birthDate: profile.birthDate ? profile.birthDate.slice(0, 10) : "",
    },
  });
  const { mutate, isPending, isError, error } = useUpdateProfile();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function onSubmit(values: FormValues) {
    mutate(values, { onSuccess: onClose });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editar perfil"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />

      <div className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-950">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <X size={18} />
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
          <h2 className="text-lg font-bold">Editar perfil</h2>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">Nombre</label>
            <input
              {...register("fullName")}
              type="text"
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              placeholder="Cuéntanos algo sobre ti"
              className="resize-none rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
            />
            {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
          </div>

          <p className="mt-1 text-xs font-semibold text-neutral-400">Datos personales</p>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">Vive en</label>
            <input
              {...register("city")}
              type="text"
              placeholder="Lima"
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">De (ciudad natal)</label>
            <input
              {...register("hometown")}
              type="text"
              placeholder="Iquitos"
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">Fecha de nacimiento</label>
            <input
              {...register("birthDate")}
              type="date"
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">Género</label>
            <select
              {...register("gender")}
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">Prefiero no decir</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">Pronombres</label>
            <select
              {...register("pronouns")}
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">Prefiero no decir</option>
              {PRONOUN_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {isError && <p className="text-xs text-red-500">{getErrorMessage(error)}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
