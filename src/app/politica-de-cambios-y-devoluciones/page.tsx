import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalSection";
import { LEGAL_PROVIDER } from "@/lib/legal";

export const metadata = {
  title: "Política de Cambios y Devoluciones",
};

export default function PoliticaCambiosPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <article className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
            Política de Cambios y Devoluciones
          </h1>
          <p className="text-sm text-neutral-500">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </header>

        <LegalSection title="Suscripciones (Reputación, Fidelización+, IA Total)">
          <p>
            Un negocio suscrito puede cancelar su suscripción mensual en cualquier momento, sin permanencia mínima ni
            penalidad, desde su panel de administración o escribiéndonos a{" "}
            <a href={`mailto:${LEGAL_PROVIDER.correo}`} className="text-primary hover:underline">
              {LEGAL_PROVIDER.correo}
            </a>
            .
          </p>
          <p>
            Al cancelar, el Servicio permanece activo hasta el final del período ya facturado. No se realizan
            reembolsos, totales ni prorrateados, por el período en curso ya pagado.
          </p>
        </LegalSection>

        <LegalSection title="Hardware físico (expositores y stands NFC)">
          <p>
            No aceptamos cambios ni devoluciones de estos productos por motivos de cambio de opinión una vez
            despachados.
          </p>
          <p>
            Esto no afecta la garantía legal que corresponde al negocio comprador como consumidor conforme al Código
            de Protección y Defensa del Consumidor (Ley N.º 29571): si el producto presenta un defecto de fabricación
            o llega dañado, tiene derecho a solicitar su reparación, reposición o devolución. Para hacerlo,
            escríbenos a{" "}
            <a href={`mailto:${LEGAL_PROVIDER.correo}`} className="text-primary hover:underline">
              {LEGAL_PROVIDER.correo}
            </a>{" "}
            detallando el problema; te indicaremos los siguientes pasos conforme a la normativa vigente.
          </p>
        </LegalSection>

        <LegalSection title="¿No estás conforme con la respuesta?">
          <p>
            Si consideras que no atendimos tu solicitud correctamente, puedes registrar un reclamo o queja en nuestro{" "}
            <Link href="/libro-de-reclamaciones" className="text-primary hover:underline">
              Libro de Reclamaciones
            </Link>
            .
          </p>
        </LegalSection>

        <div className="pt-4">
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </article>
    </div>
  );
}
