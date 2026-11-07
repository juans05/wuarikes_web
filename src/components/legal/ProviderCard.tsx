import { LEGAL_PROVIDER } from "@/lib/legal";

export function ProviderCard({
  label,
  showCorreo = true,
  showUbicacion = false,
}: {
  label: string;
  showCorreo?: boolean;
  showUbicacion?: boolean;
}) {
  return (
    <section className="space-y-1 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="text-sm text-neutral-900 dark:text-white">
        <strong>Razón social:</strong> {LEGAL_PROVIDER.razonSocial}
      </p>
      <p className="text-sm text-neutral-900 dark:text-white">
        <strong>RUC:</strong> {LEGAL_PROVIDER.ruc}
      </p>
      {showUbicacion && (
        <p className="text-sm text-neutral-900 dark:text-white">
          <strong>Domicilio:</strong> {LEGAL_PROVIDER.ubicacion}
        </p>
      )}
      {showCorreo && (
        <p className="text-sm text-neutral-900 dark:text-white">
          <strong>Correo:</strong> {LEGAL_PROVIDER.correo}
        </p>
      )}
    </section>
  );
}
