import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarCheck,
  Gift,
  MessageCircle,
  Megaphone,
  Nfc,
  QrCode,
  Star,
  Store,
} from "lucide-react";
import { PANEL_LOGIN_URL, salesWhatsApp } from "@/lib/business";

export const metadata: Metadata = {
  title: "Para negocios",
  description:
    "Haz que te encuentren en Wuarikes: perfil público, agenda con recordatorios, bot de WhatsApp, reseñas con QR y NFC, campañas y reportes. Ideal para barberías y negocios de barrio.",
  alternates: { canonical: "/negocios" },
};

// Solo funciones que hoy existen en los planes (ver specs de planes 2026-10-28).
const BENEFITS = [
  {
    Icon: Store,
    title: "Perfil en Wuarikes",
    text: "Tu negocio aparece en el buscador con fotos, horarios, ubicación y reseñas.",
  },
  {
    Icon: CalendarCheck,
    title: "Agenda y recordatorios",
    text: "Tus clientes reservan y les llega un recordatorio por WhatsApp. Menos citas perdidas.",
  },
  {
    Icon: Bot,
    title: "Bot de WhatsApp",
    text: "Responde precios, horarios y agenda citas en tu número, aunque estés atendiendo.",
  },
  {
    Icon: Star,
    title: "Más reseñas en Google",
    text: "Con una placa QR o NFC tus clientes dejan su reseña en segundos.",
  },
  {
    Icon: Megaphone,
    title: "Campañas a tus clientes",
    text: "Avisa promociones o días libres por WhatsApp a quienes ya te visitaron.",
  },
  {
    Icon: BarChart3,
    title: "Reportes",
    text: "Cuántas citas, clientes nuevos y conversaciones tuviste cada mes.",
  },
];

const VERTICALS = [
  "Barberías",
  "Peluquerías y salones",
  "Restaurantes y cafés",
  "Bodegas y tiendas",
  "Spas y bienestar",
  "Servicios",
];

const STEPS = [
  { title: "Escríbenos por WhatsApp", text: "Cuéntanos qué negocio tienes y dónde está." },
  { title: "Demo con tu negocio", text: "Te mostramos el panel funcionando con tus servicios." },
  { title: "Empiezas a recibir clientes", text: "Dejamos listo tu perfil, tu agenda y tu bot." },
];

const QR_USES = [
  { Icon: Store, text: "Abrir tu perfil en Wuarikes" },
  { Icon: Star, text: "Dejar una reseña en Google" },
  { Icon: CalendarCheck, text: "Ver tus servicios y reservar" },
];

function PrimaryCta({ className = "" }: { className?: string }) {
  return (
    <a
      href={salesWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-600 ${className}`}
    >
      <MessageCircle size={18} /> Registra tu negocio
    </a>
  );
}

export default function NegociosPage() {
  return (
    <main className="flex flex-col pb-20 lg:pb-0">
      {/* Portada */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary-50 via-background to-background px-4 pt-16 pb-20 md:pt-24 md:pb-24 dark:from-neutral-900">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200/50 blur-3xl dark:bg-primary-900/30" />
          <div className="absolute top-16 -right-20 h-80 w-80 rounded-full bg-secondary/30 blur-3xl dark:bg-secondary/10" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase">
            Wuarikes para negocios
          </p>
          <h1 className="font-heading text-4xl leading-tight font-bold text-balance text-neutral-900 md:text-6xl dark:text-neutral-50">
            Tu negocio merece ser <span className="text-primary">descubierto</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-neutral-600 md:text-lg dark:text-neutral-300">
            Con Wuarikes fortaleces tu presencia digital, conectas con nuevos clientes y tienes
            herramientas para que vuelvan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryCta />
            <a
              href={PANEL_LOGIN_URL}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-800 ring-1 ring-neutral-200 transition hover:ring-primary hover:text-primary dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-700"
            >
              Ya tengo cuenta · Iniciar sesión
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {VERTICALS.map((v, i) => (
              <span
                key={v}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  i === 0
                    ? "bg-primary text-white"
                    : "border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                }`}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl dark:text-neutral-50">
          Todo lo que tu negocio necesita para crecer
        </h2>
        <p className="mt-2 max-w-xl text-neutral-500 dark:text-neutral-400">
          Pensado para quien atiende y no tiene tiempo de estar pegado al celular.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-900/30">
                <Icon size={22} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {text}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-neutral-500">
          <Gift size={16} className="text-primary" />
          ¿Tienes equipo? También hay fidelización con tarjetas en Apple y Google Wallet.
        </p>
      </section>

      {/* Cómo funciona */}
      <section className="bg-secondary/15 px-4 py-16 md:py-24 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl dark:text-neutral-50">
            Cómo empezar
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* QR y NFC */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl dark:text-neutral-50">
            QR y NFC en tu mostrador
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Tu cliente acerca el celular a la placa o escanea el código, y en un toque llega a:
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {QR_USES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-neutral-800 dark:text-neutral-200">
                <Icon size={18} className="text-primary" /> {text}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-neutral-500">
            Un escaneo solo abre la página: no cuenta como visita ni como compra.
          </p>
        </div>
        <div className="flex justify-center gap-6">
          <div className="flex aspect-square w-40 flex-col items-center justify-center gap-3 rounded-3xl bg-white text-neutral-900 shadow-xl ring-1 ring-neutral-200 md:w-48 dark:bg-neutral-800 dark:text-neutral-50 dark:ring-neutral-700">
            <QrCode size={64} />
            <span className="text-sm font-semibold">Código QR</span>
          </div>
          <div className="mt-10 flex aspect-square w-40 flex-col items-center justify-center gap-3 rounded-3xl bg-primary text-white shadow-xl md:w-48">
            <Nfc size={64} />
            <span className="text-sm font-semibold">Placa NFC</span>
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="px-4 pb-16 md:pb-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-400 px-6 py-14 text-center text-white">
          <h2 className="font-heading text-3xl font-bold text-balance md:text-4xl">
            Que los clientes de tu barrio te encuentren
          </h2>
          <p className="max-w-lg text-white/85">
            Te mostramos cómo funciona con tu propio negocio, sin compromiso.
          </p>
          <a
            href={salesWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            Pedir una demo <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </main>
  );
}
