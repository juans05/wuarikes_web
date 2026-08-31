"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Camera, CheckCircle2, Lock, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useCategories, useSubmitPlace } from "@/hooks/usePlaces";
import { useDepartments, useDistricts, useProvinces } from "@/hooks/useUbigeo";
import { useUploadImage } from "@/hooks/useUpload";
import { useAuthStore } from "@/stores/auth.store";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { reverseGeocode } from "@/utils/reverseGeocode";
import { ImageCropModal } from "./ImageCropModal";

const LocationPicker = dynamic(
  () => import("./LocationPicker").then((m) => m.LocationPicker),
  { ssr: false },
);

const LIMA_CENTER = { latitude: -12.0464, longitude: -77.0428 };
const MAX_PHOTOS = 6;

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

type Photo = { file: File; preview: string };

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
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [cropQueue, setCropQueue] = useState<{ file: File; src: string }[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const geocodeRequestId = useRef(0);

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
  const isSubmitting = uploadingCount > 0 || submitMutation.isPending;

  async function applyLocation(latitude: number, longitude: number) {
    setLocation({ latitude, longitude });
    const requestId = ++geocodeRequestId.current;
    const address = await reverseGeocode(latitude, longitude);
    if (address && requestId === geocodeRequestId.current) {
      setValue("address", address);
    }
  }

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) =>
      applyLocation(pos.coords.latitude, pos.coords.longitude),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount
  }, []);

  function handlePhotosChange(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = MAX_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      setPhotoError(`Máximo ${MAX_PHOTOS} fotos.`);
    }
    setCropQueue((q) => [...q, ...picked.map((file) => ({ file, src: URL.createObjectURL(file) }))]);
  }

  function handleCropCancel() {
    setCropQueue([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleCropConfirm(blob: Blob) {
    const file = new File([blob], `foto-${Date.now()}.jpg`, { type: blob.type });
    setPhotos((prev) => [...prev, { file, preview: URL.createObjectURL(blob) }]);
    setPhotoError(null);
    setCropQueue((q) => q.slice(1));
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(values: FormValues) {
    if (photos.length === 0) {
      setPhotoError("Agrega al menos una foto del lugar");
      return;
    }
    setUploadingCount(photos.length);
    try {
      const urls: string[] = [];
      for (const photo of photos) {
        urls.push(await uploadMutation.mutateAsync(photo.file));
      }
      submit(values, urls);
    } catch {
      setPhotoError("No se pudieron subir las fotos. Intenta de nuevo.");
    } finally {
      setUploadingCount(0);
    }
  }

  function submit(values: FormValues, photoUrls: string[]) {
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
        coverImageUrl: photoUrls[0],
        photoUrls,
      },
      {
        onSuccess: () => setShowSuccessModal(true),
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
          onChange={applyLocation}
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
        <label className="text-sm font-medium">Fotos (hasta {MAX_PHOTOS})</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            handlePhotosChange(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-wrap gap-2">
          {photos.map((photo, i) => (
            <div key={photo.preview} className="relative h-24 w-24">
              {/* eslint-disable-next-line @next/next/no-img-element -- preview de un Blob local */}
              <img
                src={photo.preview}
                alt=""
                className="h-full w-full rounded-xl object-cover"
              />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Portada
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(i)}
                aria-label="Quitar foto"
                className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/80 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-neutral-300 text-xs text-neutral-500 dark:border-neutral-700"
            >
              <Camera size={18} />
              Agregar
            </button>
          )}
        </div>
        {photoError && <p className="text-xs text-red-500">{photoError}</p>}
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

      {cropQueue.length > 0 && (
        <ImageCropModal
          imageSrc={cropQueue[0].src}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
          <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center dark:bg-neutral-900">
            <CheckCircle2 size={40} className="text-primary" />
            <h2 className="font-heading text-lg font-bold">¡Registrado correctamente!</h2>
            <p className="text-sm text-neutral-500">
              Tu Huarique se registró correctamente. Nuestro equipo está revisando y
              validando la información antes de publicarlo.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-1 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
