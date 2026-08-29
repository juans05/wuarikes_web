import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalSection";
import { ProviderCard } from "@/components/legal/ProviderCard";
import { LEGAL_PROVIDER } from "@/lib/legal";

export const metadata = {
  title: "Términos y Condiciones",
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <article className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
            Términos y Condiciones
          </h1>
          <p className="text-sm text-neutral-500">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </header>

        <ProviderCard label="Datos del proveedor" />

        <LegalSection title="1. Objeto">
          <p>
            {LEGAL_PROVIDER.razonSocial} opera Wuarikes, una plataforma de descubrimiento de restaurantes y un
            software como servicio (SaaS) de reputación y fidelización para negocios (&quot;el Servicio&quot;). El
            Servicio se ofrece a dos tipos de usuario: (a) comensales que usan la plataforma para descubrir, reseñar
            y hacer check-in en restaurantes, de forma gratuita; y (b) restaurantes y negocios (&quot;el Cliente&quot;)
            que contratan una suscripción mensual (planes Reputación, Fidelización+ e IA Total) y, de forma
            complementaria, hardware físico (expositores y stands NFC) para su uso con el Servicio. Estos Términos y
            Condiciones regulan el acceso y uso del Servicio por ambos tipos de usuario.
          </p>
        </LegalSection>

        <LegalSection title="2. Aceptación">
          <p>
            Al crear una cuenta, contratar un plan o comprar hardware a través de nuestros canales, aceptas
            íntegramente estos Términos y Condiciones y, si corresponde, nuestra{" "}
            <Link href="/politica-de-cambios-y-devoluciones" className="text-primary hover:underline">
              Política de Cambios y Devoluciones
            </Link>
            . Si no estás de acuerdo, no debes usar el Servicio.
          </p>
        </LegalSection>

        <LegalSection title="3. Cuenta y registro">
          <p>
            Para reseñar, guardar favoritos o registrar un restaurante necesitas crear una cuenta con datos
            verídicos. Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de toda
            actividad realizada desde tu cuenta.
          </p>
        </LegalSection>

        <LegalSection title="4. Contenido generado por el usuario">
          <p>
            Las reseñas, calificaciones, fotos y comentarios que publicas deben ser veraces y corresponder a tu
            propia experiencia. Nos reservamos el derecho de moderar o retirar contenido que sea falso, ofensivo o
            que infrinja derechos de terceros.
          </p>
        </LegalSection>

        <LegalSection title="5. Planes, precios y facturación (negocios)">
          <p>
            Los planes vigentes para restaurantes, sus características y precios se muestran en{" "}
            <Link href="/agregar-restaurante" className="text-primary hover:underline">
              wuarikes.com/agregar-restaurante
            </Link>
            . La facturación es mensual y recurrente mientras la suscripción permanezca activa. El cobro se procesa
            mediante nuestra pasarela de pagos con la tarjeta que registre el negocio.
          </p>
        </LegalSection>

        <LegalSection title="6. Cancelación">
          <p>
            Un negocio suscrito puede cancelar su suscripción en cualquier momento, sin permanencia mínima ni
            penalidad. Los detalles sobre reembolsos y el momento en que la cancelación surte efecto están en
            nuestra{" "}
            <Link href="/politica-de-cambios-y-devoluciones" className="text-primary hover:underline">
              Política de Cambios y Devoluciones
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="7. Venta de hardware">
          <p>
            Los productos físicos (expositores, stands NFC) ofrecidos a los negocios se venden de forma independiente
            a la suscripción del Servicio. Las condiciones de cambio y devolución de estos productos se detallan en
            nuestra{" "}
            <Link href="/politica-de-cambios-y-devoluciones" className="text-primary hover:underline">
              Política de Cambios y Devoluciones
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="8. Propiedad intelectual">
          <p>
            El software, la marca Wuarikes, el diseño de la plataforma y los contenidos que la componen son propiedad
            de {LEGAL_PROVIDER.razonSocial} o de sus licenciantes. Cada usuario conserva la propiedad de las reseñas,
            fotos y contenido que publica, y cada negocio conserva la propiedad de la información de su propio
            restaurante que suba a la plataforma (fotos, menú, descripciones).
          </p>
        </LegalSection>

        <LegalSection title="9. Protección de datos personales">
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

        <LegalSection title="10. Limitación de responsabilidad">
          <p>
            El Servicio se brinda &quot;tal cual&quot;. {LEGAL_PROVIDER.razonSocial} no garantiza la exactitud de la
            información publicada por restaurantes ni por otros usuarios (horarios, precios, disponibilidad), y no
            responde por interrupciones atribuibles a terceros (proveedores de internet, pasarela de pagos, redes
            sociales) fuera de su control razonable.
          </p>
        </LegalSection>

        <LegalSection title="11. Modificaciones">
          <p>
            Podemos actualizar estos Términos para reflejar cambios en el Servicio o en la normativa aplicable.
            Publicaremos la versión vigente en esta misma página con su fecha de actualización.
          </p>
        </LegalSection>

        <LegalSection title="12. Ley aplicable y reclamos">
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

        <div className="pt-4">
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </article>
    </div>
  );
}
