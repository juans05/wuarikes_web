export function HostCTASection() {
  return (
    <section className="relative mx-4 overflow-hidden rounded-3xl bg-neutral-900 px-6 py-14 text-center sm:mx-auto sm:max-w-[1600px] sm:px-16 sm:text-left">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            ¿Tienes un restaurante?
          </h2>
          <p className="mt-2 max-w-md text-neutral-300">
            Descubre cuánto podrías ganar publicando tu negocio en Wuarikes y
            llega a miles de comensales.
          </p>
        </div>
        <a
          href="mailto:contacto@wuarikes.com"
          className="shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          Más información
        </a>
      </div>
    </section>
  );
}
