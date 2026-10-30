"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useUploadPlacePhoto } from "@/hooks/usePlacePhotos";
import { useUploadPlaceVideo } from "@/hooks/usePlaceVideos";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function UploadMediaModal({
  placeId,
  onClose,
}: {
  placeId: string;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const uploadPhoto = useUploadPlacePhoto(placeId);
  const uploadVideo = useUploadPlaceVideo(placeId);
  const isVideo = file?.type.startsWith("video/") ?? false;
  const mutation = isVideo ? uploadVideo : uploadPhoto;

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

  function handleFileChange(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function handleUpload() {
    if (!file) return;
    mutation.mutate(file, { onSuccess: onClose });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Subir foto o video"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-950">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold">Subir foto o video</h2>
        <p className="mt-1 text-sm text-neutral-500">Se agrega a la galería pública del local.</p>

        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 p-6 text-center transition hover:border-primary dark:border-neutral-700">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
          {preview ? (
            isVideo ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption -- previsualización local, sin audio hablado
              <video src={preview} className="max-h-48 rounded-xl" controls />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- preview de un File local, no una URL remota
              <img src={preview} alt="" className="max-h-48 rounded-xl object-contain" />
            )
          ) : (
            <>
              <ImagePlus size={28} className="text-neutral-400" />
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                Elegí una foto o video
              </span>
            </>
          )}
        </label>

        {mutation.isError && (
          <p className="mt-2 text-xs text-red-500">
            {getErrorMessage(mutation.error, "No se pudo subir el archivo. Intenta de nuevo.")}
          </p>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || mutation.isPending}
          className="mt-4 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
        >
          {mutation.isPending ? "Subiendo..." : "Subir"}
        </button>
      </div>
    </div>
  );
}
