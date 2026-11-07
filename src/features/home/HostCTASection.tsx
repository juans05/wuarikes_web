import Link from "next/link";
import { CalendarCheck, MessageCircle, Star, Store } from "lucide-react";
import { salesWhatsApp } from "@/lib/business";

const HIGHLIGHTS = [
  { Icon: Star, label: "Más reseñas con QR y NFC" },
  { Icon: CalendarCheck, label: "Agenda con recordatorios" },
  { Icon: Store, label: "Perfil en el buscador" },
];

export function HostCTASection() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4">
      <div className="relative isolate grid gap-8 overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-secondary/15 px-6 py-12 md:grid-cols-[1.4fr_1fr] md:items-center md:px-14 md:py-16 dark:border-neutral-800 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900">
        <div
          aria-hidden
          className="absolute -right-16 -bottom-16 -z-10 h-56 w-56 rounded-full bg-secondary/25 blur-2xl"
        />
        <div>
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">Para negocios</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-balance text-neutral-900 md:text-4xl dark:text-neutral-50">
            Tu negocio merece ser descubierto
          </h2>
          <p className="mt-3 max-w-lg text-neutral-600 dark:text-neutral-300">
            Barberías, restaurantes, bodegas, spas: fortalece tu presencia digital y conecta con
            nuevos clientes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={salesWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-600"
            >
              <MessageCircle size={16} /> Registra tu negocio
            </a>
            <Link
              href="/negocios"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary ring-1 ring-primary/30 transition hover:bg-primary-50 dark:bg-neutral-800"
            >
              Conoce Wuarikes para negocios
            </Link>
          </div>
        </div>
        <ul className="flex flex-col gap-3">
          {HIGHLIGHTS.map(({ Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-800 dark:ring-neutral-700"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-900/40">
                <Icon size={18} />
              </span>
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
