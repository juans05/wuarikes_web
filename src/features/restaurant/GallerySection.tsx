"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Play } from "lucide-react";
import { useCheckinsFeed } from "@/hooks/useCheckins";
import { usePlaceVideos } from "@/hooks/usePlaceVideos";

type Tab = "photos" | "videos";

export function GallerySection({ placeId }: { placeId: string }) {
  const [tab, setTab] = useState<Tab>("photos");
  const { data: checkins } = useCheckinsFeed({ placeId, size: 50, hasPhotos: true });
  const { data: videos } = usePlaceVideos(placeId);

  const photos = useMemo(() => {
    const urls = (checkins?.data ?? []).flatMap((c) =>
      [c.photoUrl, ...c.photos].filter((url): url is string => Boolean(url)),
    );
    return Array.from(new Set(urls));
  }, [checkins]);

  const videoList = videos?.data ?? [];

  return (
    <section id="galeria" className="scroll-mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Fotos y videos</h2>
        <div role="tablist" aria-label="Galería" className="ml-auto flex gap-1 rounded-full bg-neutral-100 p-1 text-xs dark:bg-neutral-800">
          <TabButton id="photos" active={tab === "photos"} onClick={() => setTab("photos")}>
            Fotos ({photos.length})
          </TabButton>
          <TabButton id="videos" active={tab === "videos"} onClick={() => setTab("videos")}>
            Videos ({videoList.length})
          </TabButton>
        </div>
      </div>

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
