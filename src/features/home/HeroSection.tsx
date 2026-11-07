import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { PANEL_URL } from "@/lib/business";
import { rubroQuery } from "@/hooks/useVerticalFilter";
import { HeroSearchBar } from "./HeroSearchBar";

// Atajos al estilo "planes a tu medida": cada uno es solo un filtro de /restaurantes.
const QUICK_FILTERS = [
  { label: "🟢 Abierto ahora", query: "abierto=1" },
  { label: "🪙 Al paso", query: "hasta=20" },
  { label: "⭐ Mejor valorados", query: "rating=4.5" },
  { label: "🎁 Con promos", query: "promo=1" },
];

export function HeroSection({ vertical }: { vertical?: string }) {
  const rubro = rubroQuery(vertical);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary-50 via-background to-background dark:from-neutral-900 dark:via-background">
      {/* Manchas de color de marca, suaves: rocoto, ají y hierba. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200/50 blur-3xl dark:bg-primary-900/30" />
        <div className="absolute top-10 -right-20 h-80 w-80 rounded-full bg-secondary/30 blur-3xl dark:bg-secondary/10" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-900/20" />
      </div>

      <Logo className="absolute top-4 left-4 lg:hidden" />

      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 pt-20 pb-12 text-center md:pt-24 md:pb-16">
        <h1 className="font-heading text-4xl leading-tight font-bold text-balance text-neutral-900 md:text-6xl dark:text-neutral-50">
          Descubre. <span className="text-primary">Conecta.</span> Disfruta.
        </h1>
        <p className="mt-4 max-w-xl text-base text-neutral-600 md:text-lg dark:text-neutral-300">
          Encuentra los mejores negocios cerca de ti, descubre experiencias y aprovecha beneficios
          exclusivos.
        </p>

        <div className="mt-8 w-full max-w-2xl">
          <HeroSearchBar vertical={vertical} />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {QUICK_FILTERS.map(({ label, query }) => (
            <Link
              key={query}
              href={`/restaurantes?${query}${rubro}`}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {label}
            </Link>
          ))}
        </div>

        <a
          href={PANEL_URL}
          className="mt-7 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          ¿Tienes un negocio? Haz que te encuentren →
        </a>
      </div>
    </section>
  );
}
