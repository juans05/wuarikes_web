"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, Star, X } from "lucide-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useCreateCheckin } from "@/hooks/useCheckins";
import { useUploadImage } from "@/hooks/useUpload";
import { getErrorMessage } from "@/utils/getErrorMessage";

const schema = z.object({
  rating: z.number().min(1, "Selecciona una calificación").max(5),
  comment: z.string().max(200, "Máximo 200 caracteres").optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateReviewForm({
  placeId,
  onCheckedIn,
}: {
  placeId: string;
  onCheckedIn?: () => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, comment: "" },
  });
  const { mutate, isPending, isError, error } = useCreateCheckin(placeId);
  const uploadMutation = useUploadImage();
  const rating = watch("rating");
  const isSubmitting = isPending || uploadMutation.isPending;
  const coordsRef = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      coordsRef.current = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    });
  }, []);

  function handlePhotoChange(file: File | null) {
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  function onSubmit(values: FormValues) {
    if (!photo) {
      submitCheckin(values, undefined);
      return;
    }
    uploadMutation.mutate(photo, {
      onSuccess: (url) => submitCheckin(values, url),
    });
  }

  function submitCheckin(values: FormValues, photoUrl: string | undefined) {
    mutate(
      {
        placeId,
        rating: values.rating,
        comment: values.comment,
        photoUrl,
        latitude: coordsRef.current?.latitude,
        longitude: coordsRef.current?.longitude,
      },
      {
        onSuccess: () => {
          reset({ rating: 0, comment: "" });
          handlePhotoChange(null);
          onCheckedIn?.();
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
        {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onClick={() => setValue("rating", star, { shouldValidate: true })}
            aria-label={`${star} estrellas`}
          >
            <Star
              size={24}
              className={clsx(
                (hoverRating || rating) >= star
                  ? "fill-secondary text-secondary"
                  : "fill-transparent text-neutral-300 dark:text-neutral-600",
              )}
            />
          </button>
        ))}
      </div>
      {errors.rating && (
        <p className="text-xs text-red-500">{errors.rating.message}</p>
      )}

      <textarea
        {...register("comment")}
        placeholder="Cuéntanos tu experiencia (opcional)"
        rows={2}
        maxLength={200}
        className="resize-none rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
      />
      {errors.comment && (
        <p className="text-xs text-red-500">{errors.comment.message}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
      />
      {photoPreview ? (
        <div className="relative h-28 w-28">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview de un File local, no una URL remota */}
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
          className="flex w-fit items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
        >
          <Camera size={14} />
          Agregar foto
        </button>
      )}

      {isError && (
        <p className="text-xs text-red-500">
          {(error as { response?: { status?: number } })?.response?.status === 401
            ? "Inicia sesión para publicar una reseña."
            : getErrorMessage(error, "No se pudo publicar la reseña. Intenta de nuevo.")}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {isSubmitting ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  );
}
