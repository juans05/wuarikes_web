"use client";

import { useSearchTikTok } from "@/hooks/usePlaces";
import type { Place } from "@/types/place";

interface TikTokVideo {
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
  authorName: string | null;
}

function extractVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

export function TikTokSection({ place }: { place: Place }) {
  const cachedVideos = (place.metadata as { tiktokVideos?: TikTokVideo[] } | null)?.tiktokVideos;
  // Sin videos cacheados todavía (nunca se buscó) → dispara la búsqueda en
  // caliente al entrar a la página. Si ya se buscó antes y no había nada,
  // el backend guarda `tiktokVideos: []` — no reintenta en cada visita.
  const { data: searched, isLoading } = useSearchTikTok(place.id, cachedVideos === undefined);

  const videos = cachedVideos ?? searched?.videos ?? [];

  if (videos.length === 0) {
    if (isLoading) {
      return (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">En TikTok</h2>
          <p className="text-sm text-neutral-400">Buscando videos en TikTok…</p>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">En TikTok</h2>
        <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white dark:bg-white dark:text-neutral-900">
          TikTok
        </span>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
        {videos.map((video) => {
          const videoId = extractVideoId(video.url);
          if (!videoId) return null;
          return (
            <div
              key={video.url}
              className="h-[730px] w-[325px] shrink-0 snap-start overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800"
            >
              {/* Iframe directo de TikTok en vez del widget blockquote+embed.js: ese
                  widget solo convierte el bloque en un player al cargar la página, y
                  no vuelve a escanear el DOM de forma confiable al navegar de un
                  restaurante a otro dentro de esta app de una sola página. */}
              <iframe
                src={`https://www.tiktok.com/embed/v2/${videoId}`}
                title={video.caption ?? "Video de TikTok"}
                allow="encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
