"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Camera, Lock, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useCategories, useSubmitPlace } from "@/hooks/usePlaces";
import { useDepartments, useDistricts, useProvinces } from "@/hooks/useUbigeo";
import { useUploadImage } from "@/hooks/useUpload";
import { useAuthStore } from "@/stores/auth.store";
import { getErrorMessage } from "@/utils/getErrorMessage";

const LocationPicker = dynamic(
  () => import("./LocationPicker").then((m) => m.LocationPicker),
  { ssr: false },
);

const LIMA_CENTER = { latitude: -12.0464, longitude: -77.0428 };

const schema = z.object({
  name: z.string().min(2, "Ingresa el nombre del lugar"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  department: z.string().min(1, "Selecciona un departamento"),
  province: z.string().min(1, "Selecciona una provincia"),
  district: z.string().min(1, "Selecciona un distrito"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPlaceForm() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
        <Lock size={32} className="text-neutral-300" />
        <p className="text-sm text-neutral-500">
          Inicia sesión para agregar un restaurante nuevo.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return <RegisterPlaceFormFields />;
}

function RegisterPlaceFormFields() {
  const router = useRouter();
  const [location, setLocation] = useState(LIMA_CENTER);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const department = watch("department");
  const province = watch("province");

  const { data: categories } = useCategories();
  const { data: departments } = useDepartments();
  const { data: provinces } = useProvinces(department || null);
  const { data: districts } = useDistricts(department || null, province || null);
  const uploadMutation = useUploadImage();
  const submitMutation = useSubmitPlace();
  const isSubmitting = uploadMutation.isPending || submitMutation.isPending;

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) =>
      setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
    );
  }, []);

  function handlePhotoChange(file: File | null) {
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  function onSubmit(values: FormValues) {
    if (!photo) {
      submit(values, undefined);
      return;
    }
    uploadMutation.mutate(photo, { onSuccess: (url) => submit(values, url) });
  }

  function submit(values: FormValues, coverImageUrl: string | undefined) {
    submitMutation.mutate(
      {
        name: values.name,
        description: values.description || undefined,
        categoryId: values.categoryId,
        district: values.district,
        address: values.address || undefined,
        phone: values.phone || undefined,
        latitude: location.latitude,
        longitude: location.longitude,
        coverImageUrl,
      },
      {
        onSuccess: () => router.push("/"),
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-lg flex-col gap-4 p-4"
    >
      <h1 className="font-heading text-xl font-bold">Nuevo Huarique</h1>
      <p className="text-sm text-neutral-500">
        Ayúdanos a sumar tu restaurante favorito. Lo revisaremos antes de publicarlo.
      </p>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Ubicación</label>
        <LocationPicker
          latitude={location.latitude}
          longitude={location.longitude}
          onChange={(latitude, longitude) => setLocation({ latitude, longitude })}
        />
        <p className="text-xs text-neutral-400">Toca el mapa para ajustar el punto exacto.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Nombre del lugar</label>
        <input
          {...register("name")}
          placeholder="Ej: El Rinconcito del Sabor"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Departamento</label>
          <select
            {...register("department")}
            onChange={(e) => {
              setValue("department", e.target.value);
              setValue("province", "");
              setValue("district", "");
            }}
            className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Selecciona uno</option>
            {departments?.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-xs text-red-500">{errors.department.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Provincia</label>
          <select
            {...register("province")}
            disabled={!department}
            onChange={(e) => {
              setValue("province", e.target.value);
              setValue("district", "");
            }}
            className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Selecciona una</option>
            {provinces?.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="text-xs text-red-500">{errors.province.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Distrito</label>
          <select
            {...register("district")}
            disabled={!province}
            className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Selecciona uno</option>
            {districts?.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-xs text-red-500">{errors.district.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Dirección (opcional)</label>
        <input
          {...register("address")}
          placeholder="Ej: Av. José Larco 1232"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Categoría</label>
        <select
          {...register("categoryId")}
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="">Selecciona una</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-xs text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Teléfono (opcional)</label>
        <input
          {...register("phone")}
          placeholder="Ej: +51 1 2441234"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Descripción (opcional)</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="¿Qué lo hace especial?"
          className="resize-none rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Foto (opcional)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
        />
        {photoPreview ? (
          <div className="relative h-32 w-32">
            {/* eslint-disable-next-line @next/next/no-img-element -- preview de un File local */}
            <img
              src={photoPreview}
              alt=""
              className="h-full w-full rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={() => handlePhotoChange(null)}
              aria-label="Quitar foto"
              className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/80 text-white"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 dark:border-neutral-700"
          >
            <Camera size={18} />
            Subir foto del local o platos
          </button>
        )}
      </div>

      {submitMutation.isError && (
        <p className="text-xs text-red-500">{getErrorMessage(submitMutation.error)}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {isSubmitting ? "Guardando..." : "Guardar Huarique"}
      </button>
    </form>
  );
}
