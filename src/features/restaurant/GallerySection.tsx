"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Pencil, Play } from "lucide-react";
import { useCheckinsFeed } from "@/hooks/useCheckins";
import { usePlaceVideos, useUploadPlaceVideo } from "@/hooks/usePlaceVideos";
import { usePlacePhotos, useUploadPlacePhoto } from "@/hooks/usePlacePhotos";
import { getErrorMessage } from "@/utils/getErrorMessage";

type Tab = "photos" | "videos";

export function GallerySection({ placeId, isOwner }: { placeId: string; isOwner: boolean }) {
  const [tab, setTab] = useState<Tab>("photos");
  const { data: checkins } = useCheckinsFeed({ placeId, size: 50, hasPhotos: true });
  const { data: videos } = usePlaceVideos(placeId);
  const { data: placePhotos } = usePlacePhotos(placeId);
  const uploadPhoto = useUploadPlacePhoto(placeId);
  const uploadVideo = useUploadPlaceVideo(placeId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(file: File | null) {
    if (!file) return;
    if (file.type.startsWith("video/")) {
      uploadVideo.mutate(file);
    } else {
      uploadPhoto.mutate(file);
    }
  }

  const photos = useMemo(() => {
    // Las del registro del local van primero — son curadas, no dependen de que
    // alguien haya hecho check-in todavía.
    const curated = (placePhotos?.data ?? []).map((p) => p.url);
    const fromCheckins = (checkins?.data ?? []).flatMap((c) =>
      [c.photoUrl, ...c.photos].filter((url): url is string => Boolean(url)),
    );
    return Array.from(new Set([...curated, ...fromCheckins]));
  }, [placePhotos, checkins]);

  const videoList = videos?.data ?? [];

  const isUploading = uploadPhoto.isPending || uploadVideo.isPending;

  return (
    <section id="galeria" className="scroll-mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Fotos y videos</h2>
        {isOwner && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime"
              className="hidden"
              onChange={(e) => {
                handleFileChange(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              aria-label="Subir foto o video"
              title="Subir foto o video"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-300"
            >
              <Pencil size={13} />
            </button>
          </>
        )}
        <div role="tablist" aria-label="Galería" className="ml-auto flex gap-1 rounded-full bg-neutral-100 p-1 text-xs dark:bg-neutral-800">
          <TabButton id="photos" active={tab === "photos"} onClick={() => setTab("photos")}>
            Fotos ({photos.length})
          </TabButton>
          <TabButton id="videos" active={tab === "videos"} onClick={() => setTab("videos")}>
            Videos ({videoList.length})
          </TabButton>
        </div>
      </div>

      {(uploadPhoto.isError || uploadVideo.isError) && (
        <p className="text-xs text-red-500">
          {getErrorMessage(uploadPhoto.error || uploadVideo.error, "No se pudo subir el archivo. Intenta de nuevo.")}
        </p>
      )}

      {tab === "photos" && (
        <div role="tabpanel" aria-label="Fotos" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {photos.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800"
            >
              <Image
                src={url}
                alt="Foto de una reseña"
                fill
                sizes="(max-width: 640px) 50vw, 260px"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
          ))}
          {photos.length === 0 && (
            <p className="col-span-3 text-sm text-neutral-500">Todavía no hay fotos.</p>
          )}
        </div>
      )}

      {tab === "videos" && (
        <div role="tabpanel" aria-label="Videos" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {videoList.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Reproducir video (se abre en una pestaña nueva)"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-900"
            >
              {video.thumbnailUrl && (
                <Image
                  src={video.thumbnailUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 260px"
                  className="object-cover opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/10">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <Play size={18} className="fill-neutral-900 text-neutral-900" />
                </span>
              </span>
            </a>
          ))}
          {videoList.length === 0 && (
            <p className="col-span-3 text-sm text-neutral-500">Todavía no hay videos.</p>
          )}
        </div>
      )}
    </section>
  );
}

function TabButton({
  id,
  active,
  onClick,
  children,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-selected={active}
      onClick={onClick}
      className={clsx(
        "rounded-full px-3 py-1 font-medium transition",
        active ? "bg-primary text-white" : "text-neutral-500",
      )}
    >
      {children}
    </button>
  );
}
