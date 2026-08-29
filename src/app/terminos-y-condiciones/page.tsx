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

        <LegalSection title="3. Edad mínima y capacidad">
          <p>
            Wuarikes no está dirigido a menores de 18 años. Para crear una cuenta y usar las funciones del Servicio
            (reseñas, check-ins, fidelización) declaras tener al menos 18 años y capacidad legal para contratar.
            Puedes usar las funciones de búsqueda y descubrimiento sin necesidad de una cuenta.
          </p>
        </LegalSection>

        <LegalSection title="4. Cuenta y registro">
          <p>
            Para reseñar, guardar favoritos o hacer check-in necesitas crear una cuenta con datos verídicos. Eres
            responsable de mantener la confidencialidad de tus credenciales de acceso y de toda actividad realizada
            desde tu cuenta. Tu cuenta es personal e intransferible: no puedes cederla, venderla ni compartir tus
            credenciales con terceros. El Servicio es gratuito para el Usuario: no cobramos por registrarte ni por
            usar sus funciones de descubrimiento y reseñas.
          </p>
        </LegalSection>

        <LegalSection title="5. Conductas prohibidas">
          <p>Al usar el Servicio, te comprometes a no:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Crear más de una cuenta para manipular reseñas, calificaciones o el sistema de puntos.</li>
            <li>Publicar reseñas falsas, calificaciones fraudulentas o contenido pagado sin declararlo como tal.</li>
            <li>Suplantar la identidad de otra persona o de un negocio.</li>
            <li>Usar bots, scraping automatizado o cualquier medio automatizado para extraer datos de la plataforma.</li>
            <li>Usar el Servicio para acosar, amenazar o difamar a un restaurante, sus colaboradores u otros usuarios.</li>
            <li>Intentar vulnerar la seguridad de la plataforma o acceder a cuentas ajenas sin autorización.</li>
          </ul>
        </LegalSection>

        <LegalSection title="6. Contenido generado por el usuario">
          <p>
            Las reseñas, calificaciones, fotos y comentarios que publicas deben ser veraces y corresponder a tu
            propia experiencia. Nos reservamos el derecho de moderar o retirar contenido que incumpla estos Términos,
            y de suspender cuentas que lo hagan de forma reiterada.
          </p>
        </LegalSection>

        <LegalSection title="7. Programa de fidelización">
          <p>
            Los puntos, sellos, niveles e insignias que acumulas mediante check-ins y otras actividades dentro del
            Servicio no tienen valor monetario, no son transferibles ni canjeables por dinero. Pueden vencer por
            inactividad prolongada de tu cuenta (más de 12 meses sin actividad) o cuando el restaurante que los
            emitió discontinúe su programa de fidelización; en ese caso, los puntos asociados a ese restaurante se
            pierden sin derecho a compensación. Podemos modificar o discontinuar el programa de fidelización en
            cualquier momento.
          </p>
        </LegalSection>

        <LegalSection title="8. Relación con los restaurantes">
          <p>
            Wuarikes es un intermediario tecnológico: no es dueño, no opera ni es parte de los restaurantes listados
            en la plataforma. No vendemos comida ni bebidas ni procesamos pagos entre tú y el restaurante, y no
            somos responsables de la calidad, higiene, precios o disponibilidad de lo que ofrece cada negocio, ni de
            disputas entre tú y el restaurante. Cualquier reclamo sobre el servicio recibido en un restaurante debe
            dirigirse directamente a ese negocio.
          </p>
        </LegalSection>

        <LegalSection title="9. Propiedad intelectual">
          <p>
            El software, la marca Wuarikes, el diseño de la plataforma y los contenidos que la componen son propiedad
            de {LEGAL_PROVIDER.razonSocial} o de sus licenciantes. Conservas la propiedad de las reseñas, fotos y
            contenido que publicas, y al subirlos nos otorgas una licencia no exclusiva para mostrarlos dentro del
            Servicio.
          </p>
        </LegalSection>

        <LegalSection title="10. Protección de datos personales">
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

        <LegalSection title="11. Disponibilidad del servicio">
          <p>
            Nos esforzamos por mantener el Servicio disponible, pero no garantizamos que funcione de forma
            ininterrumpida o libre de errores. Podemos modificar, suspender o discontinuar funciones del Servicio en
            cualquier momento, incluyendo por mantenimiento, mejoras o razones fuera de nuestro control razonable.
          </p>
        </LegalSection>

        <LegalSection title="12. Limitación de responsabilidad">
          <p>
            El Servicio se brinda &quot;tal cual&quot;. {LEGAL_PROVIDER.razonSocial} no garantiza la exactitud de la
            información publicada por los restaurantes ni por otros usuarios (horarios, precios, disponibilidad), y
            no responde por interrupciones atribuibles a terceros (proveedores de internet, redes sociales) fuera de
            su control razonable.
          </p>
        </LegalSection>

        <LegalSection title="13. Indemnización">
          <p>
            Aceptas indemnizar y mantener indemne a {LEGAL_PROVIDER.razonSocial} frente a cualquier reclamo, daño o
            gasto razonable (incluyendo honorarios legales) que surja de tu incumplimiento de estos Términos o del
            uso indebido del Servicio, incluyendo contenido que publiques y que genere un reclamo de un tercero.
          </p>
        </LegalSection>

        <LegalSection title="14. Suspensión y terminación de cuenta">
          <p>
            Podemos suspender o cerrar tu cuenta si incumples estos Términos, sin perjuicio de otras acciones que
            correspondan conforme a la ley. Puedes cerrar tu cuenta en cualquier momento escribiéndonos a{" "}
            <a href={`mailto:${LEGAL_PROVIDER.correo}`} className="text-primary hover:underline">
              {LEGAL_PROVIDER.correo}
            </a>
            . Al cerrar tu cuenta, las secciones que por su naturaleza deban continuar vigentes (propiedad
            intelectual, indemnización, ley aplicable) permanecen aplicables.
          </p>
        </LegalSection>

        <LegalSection title="15. Modificaciones">
          <p>
            Podemos actualizar estos Términos para reflejar cambios en el Servicio o en la normativa aplicable.
            Publicaremos la versión vigente en esta misma página con su fecha de actualización, y te avisaremos de
            cambios sustanciales por correo electrónico o mediante un aviso dentro de la plataforma. El uso
            continuado del Servicio después de una actualización implica tu aceptación de los nuevos Términos.
          </p>
        </LegalSection>

        <LegalSection title="16. Cesión">
          <p>
            Podemos ceder o transferir estos Términos, total o parcialmente, en caso de fusión, adquisición o venta
            de activos, sin necesidad de tu consentimiento previo. Tú no puedes ceder tus derechos u obligaciones
            bajo estos Términos sin nuestro consentimiento por escrito.
          </p>
        </LegalSection>

        <LegalSection title="17. Divisibilidad">
          <p>
            Si alguna disposición de estos Términos es declarada inválida o inaplicable por una autoridad competente,
            las demás disposiciones continuarán vigentes.
          </p>
        </LegalSection>

        <LegalSection title="18. Ley aplicable, jurisdicción y reclamos">
          <p>
            Estos Términos se rigen por las leyes de la República del Perú. Ante cualquier controversia, las partes
            se someten a la jurisdicción de los jueces y tribunales de Lima, sin perjuicio de tu derecho como
            consumidor a presentar tu reclamo ante el INDECOPI. Si tienes un reclamo o queja, puedes usar nuestro{" "}
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

        <LegalSection title="19. ¿Eres dueño de un restaurante?">
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
