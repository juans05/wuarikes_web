"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PlaceCard } from "@/components/ui/PlaceCard";
import type { Place } from "@/types/place";

export function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: ReactNode;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-2xl font-bold text-neutral-900 md:text-3xl dark:text-neutral-50">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-primary"
        >
          Ver todo
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function PlaceRow({
  title,
  subtitle,
  href,
  places,
}: {
  title: ReactNode;
  subtitle?: string;
  href?: string;
  places: Place[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [places.length]);

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  if (places.length === 0) return null;

  // Flechas solo con mouse (md+): en celular se desliza con el dedo.
  const arrow =
    "absolute top-1/3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-800 shadow-lg ring-1 ring-neutral-200 transition hover:scale-105 hover:text-primary md:flex dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-700";

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4">
      <SectionHeader title={title} subtitle={subtitle} href={href} />
      <div className="relative">
        {!edges.start && (
          <button type="button" aria-label="Anterior" onClick={() => scrollByPage(-1)} className={`${arrow} -left-3`}>
            <ChevronLeft size={20} />
          </button>
        )}
        <div
          ref={trackRef}
          onScroll={updateEdges}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none]"
        >
          {places.map((place) => (
            <div key={place.id} className="w-[78%] shrink-0 snap-start sm:w-72">
              <PlaceCard place={place} />
            </div>
          ))}
        </div>
        {!edges.end && (
          <button type="button" aria-label="Siguiente" onClick={() => scrollByPage(1)} className={`${arrow} -right-3`}>
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
}
