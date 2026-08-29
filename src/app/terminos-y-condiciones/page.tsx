import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalSection";
import { ProviderCard } from "@/components/legal/ProviderCard";
import { LEGAL_PROVIDER } from "@/lib/legal";

export const metadata = {
  title: "Términos y Condiciones",
};

const ADMIN_TERMINOS_URL = "https://admin.wuarikes.com/terminos-y-condiciones";

export default function TerminosPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <article className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
            Términos y Condiciones
          </h1>
          <p className="text-sm text-neutral-500">
            Aplican al uso de Wuarikes como usuario final (comensal). Última actualización:{" "}
            {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </header>

        <ProviderCard label="Datos del proveedor" />

        <LegalSection title="1. Objeto">
          <p>
            {LEGAL_PROVIDER.razonSocial} opera Wuarikes, una plataforma gratuita de descubrimiento de restaurantes
            (&quot;el Servicio&quot;) que permite a los usuarios buscar restaurantes, dejar reseñas, hacer check-in y
            acumular puntos de fidelización. Estos Términos y Condiciones regulan el acceso y uso del Servicio por
            parte de los usuarios finales (&quot;el Usuario&quot;).
          </p>
        </LegalSection>

        <LegalSection title="2. Aceptación">
          <p>
            Al crear una cuenta o usar el Servicio, aceptas íntegramente estos Términos y Condiciones. Si no estás de
            acuerdo, no debes usar el Servicio.
          </p>
        </LegalSection>

        <LegalSection title="3. Cuenta y registro">
          <p>
            Para reseñar, guardar favoritos o hacer check-in necesitas crear una cuenta con datos verídicos. Eres
            responsable de mantener la confidencialidad de tus credenciales de acceso y de toda actividad realizada
            desde tu cuenta. El Servicio es gratuito para el Usuario: no cobramos por registrarte ni por usar sus
            funciones de descubrimiento y reseñas.
          </p>
        </LegalSection>

        <LegalSection title="4. Contenido generado por el usuario">
          <p>
            Las reseñas, calificaciones, fotos y comentarios que publicas deben ser veraces y corresponder a tu
            propia experiencia. Está prohibido publicar reseñas falsas, contenido difamatorio, spam, o contenido que
            infrinja derechos de terceros. Nos reservamos el derecho de moderar o retirar contenido que incumpla lo
            anterior, y de suspender cuentas que lo hagan de forma reiterada.
          </p>
        </LegalSection>

        <LegalSection title="5. Programa de fidelización">
          <p>
            Los puntos, sellos, niveles e insignias que acumulas mediante check-ins y otras actividades dentro del
            Servicio no tienen valor monetario, no son transferibles ni canjeables por dinero, y su vigencia y reglas
            de canje pueden variar según lo que ofrezca cada restaurante participante.
          </p>
        </LegalSection>

        <LegalSection title="6. Propiedad intelectual">
          <p>
            El software, la marca Wuarikes, el diseño de la plataforma y los contenidos que la componen son propiedad
            de {LEGAL_PROVIDER.razonSocial} o de sus licenciantes. Conservas la propiedad de las reseñas, fotos y
            contenido que publicas, y al subirlos nos otorgas una licencia no exclusiva para mostrarlos dentro del
            Servicio.
          </p>
        </LegalSection>

        <LegalSection title="7. Protección de datos personales">
          <p>
            Tratamos los datos personales que nos proporcionas conforme a la Ley N.º 29733, Ley de Protección de
            Datos Personales, y su reglamento. Los detalles sobre qué datos recolectamos, para qué los usamos y con
            quién los compartimos están en nuestra{" "}
            <Link href="/politica-de-privacidad" className="text-primary hover:underline">
              Política de Privacidad
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="8. Limitación de responsabilidad">
          <p>
            El Servicio se brinda &quot;tal cual&quot;. {LEGAL_PROVIDER.razonSocial} no garantiza la exactitud de la
            información publicada por los restaurantes ni por otros usuarios (horarios, precios, disponibilidad), y
            no responde por interrupciones atribuibles a terceros (proveedores de internet, redes sociales) fuera de
            su control razonable.
          </p>
        </LegalSection>

        <LegalSection title="9. Modificaciones">
          <p>
            Podemos actualizar estos Términos para reflejar cambios en el Servicio o en la normativa aplicable.
            Publicaremos la versión vigente en esta misma página con su fecha de actualización.
          </p>
        </LegalSection>

        <LegalSection title="10. Ley aplicable y reclamos">
          <p>
            Estos Términos se rigen por las leyes de la República del Perú. Si tienes un reclamo o queja como
            consumidor, puedes usar nuestro{" "}
            <Link href="/libro-de-reclamaciones" className="text-primary hover:underline">
              Libro de Reclamaciones
            </Link>{" "}
            o escribirnos a{" "}
            <a href={`mailto:${LEGAL_PROVIDER.correo}`} className="text-primary hover:underline">
              {LEGAL_PROVIDER.correo}
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title="11. ¿Eres dueño de un restaurante?">
          <p>
            Estos Términos aplican solo al uso de Wuarikes como usuario final. Si quieres registrar tu negocio y
            contratar el Servicio para restaurantes (planes de reputación y fidelización, hardware NFC), consulta los{" "}
            <a href={ADMIN_TERMINOS_URL} className="text-primary hover:underline">
              Términos y Condiciones del Servicio para Negocios
            </a>
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
