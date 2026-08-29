import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalSection";
import { ProviderCard } from "@/components/legal/ProviderCard";
import { LEGAL_PROVIDER } from "@/lib/legal";

export const metadata = {
  title: "Política de Privacidad",
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <article className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
            Política de Privacidad
          </h1>
          <p className="text-sm text-neutral-500">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </header>

        <ProviderCard label="Titular del banco de datos" />

        <LegalSection title="1. Alcance">
          <p>
            Esta política explica cómo {LEGAL_PROVIDER.razonSocial} recolecta, usa y protege los datos personales de:
            (a) los comensales y usuarios que usan Wuarikes para descubrir restaurantes, reseñar y hacer check-in,
            (b) los dueños y colaboradores de los negocios que usan Wuarikes, y (c) los visitantes de nuestro sitio
            web. No aplica a datos que un restaurante recolecte por sus propios medios, fuera de Wuarikes.
          </p>
        </LegalSection>

        <LegalSection title="2. Qué datos recolectamos">
          <p>
            <strong>De comensales y usuarios:</strong> nombre, correo y/o teléfono, contraseña (almacenada cifrada,
            nunca en texto plano), reseñas y calificaciones, historial de check-ins, favoritos, saldo y actividad en
            el programa de fidelización (sellos o puntos), y el contenido de tus conversaciones con nuestro asistente
            de WhatsApp cuando escribes a un negocio que usa Wuarikes.
          </p>
          <p>
            <strong>De dueños y colaboradores de negocios:</strong> nombre, correo, teléfono, contraseña (almacenada
            cifrada), rol dentro del equipo, y datos del negocio (nombre, categoría, ubicación, horarios, fotos y,
            cuando reclamas un local ya publicado, documentos de sustento como RUC, licencia de funcionamiento o
            recibos a nombre del negocio).
          </p>
          <p>
            <strong>Datos de pago:</strong> cuando un negocio contrata un plan pagado, el número de tarjeta se
            captura y procesa directamente por nuestra pasarela de pagos (Culqi). {LEGAL_PROVIDER.razonSocial} nunca
            recibe ni almacena el número completo de la tarjeta.
          </p>
          <p>
            <strong>Datos técnicos:</strong> dirección IP y datos básicos de uso de la plataforma para fines de
            seguridad y soporte.
          </p>
        </LegalSection>

        <LegalSection title="3. Cómo obtenemos tus datos">
          <p>
            Directamente de ti cuando te registras, completas un formulario (registro de restaurante, reclamo de
            negocio, Libro de Reclamaciones), escaneas un código QR/NFC, escribes por WhatsApp, o realizas un pago.
            En algunos casos también importamos reseñas públicas ya publicadas en Google Maps sobre el negocio.
          </p>
        </LegalSection>

        <LegalSection title="4. Para qué usamos tus datos">
          <ul className="list-disc space-y-2 pl-5">
            <li>Crear y administrar tu cuenta, y brindar las funciones de la plataforma.</li>
            <li>Procesar pagos y gestionar la suscripción de un negocio.</li>
            <li>Operar el programa de fidelización y entregar tu tarjeta digital (Apple Wallet / Google Wallet).</li>
            <li>
              Responder tus mensajes a través de nuestro asistente de WhatsApp, incluyendo el uso de inteligencia
              artificial para generar respuestas basadas en la información del negocio.
            </li>
            <li>
              Enviar comunicaciones operativas (confirmaciones, avisos de cobro, respuestas a reclamos) y, solo si
              diste tu consentimiento, comunicaciones promocionales.
            </li>
            <li>Prevenir fraude, dar soporte técnico y cumplir obligaciones legales.</li>
          </ul>
          <p>No vendemos tus datos personales a terceros, ni los usamos para fines distintos a los aquí descritos.</p>
        </LegalSection>

        <LegalSection title="5. Con quién compartimos datos">
          <p>
            Para operar Wuarikes trabajamos con proveedores externos que procesan datos por nuestro encargo,
            únicamente para las finalidades indicadas:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Culqi</strong> — procesamiento de pagos con tarjeta.
            </li>
            <li>
              <strong>Meta (WhatsApp Business Platform) y PlazBot</strong> — envío y recepción de mensajes de
              WhatsApp.
            </li>
            <li>
              <strong>Proveedores de inteligencia artificial</strong> (como Anthropic y otros enrutados vía
              OpenRouter) — generación de respuestas del asistente de WhatsApp y de contenido asistido por IA.
            </li>
            <li>
              <strong>Cloudinary</strong> — almacenamiento de fotos y documentos que subes a la plataforma.
            </li>
            <li>
              <strong>Resend</strong> — envío de correos transaccionales (verificación, recibos, reportes).
            </li>
            <li>
              <strong>Google y Apple</strong> — emisión de tarjetas de fidelización digitales (Wallet).
            </li>
          </ul>
          <p>También podemos divulgar datos si una autoridad competente lo exige mediante mandato legal o judicial.</p>
        </LegalSection>

        <LegalSection title="6. Transferencia internacional de datos">
          <p>
            Algunos de los proveedores listados en la sección anterior procesan información en servidores ubicados
            fuera del Perú. Al usar Wuarikes, aceptas esta transferencia internacional de tus datos personales,
            necesaria para prestarte el servicio, conforme al artículo 15 de la Ley N.º 29733.
          </p>
        </LegalSection>

        <LegalSection title="7. Conservación de datos">
          <p>
            Conservamos tus datos mientras tu cuenta permanezca activa. Si la cancelas, conservamos la información
            adicional que exijan normas tributarias, contables o de otra índole legal, y luego la eliminamos o
            anonimizamos.
          </p>
        </LegalSection>

        <LegalSection title="8. Seguridad">
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger tus datos (cifrado de contraseñas,
            control de acceso por roles, conexiones cifradas). Ningún sistema es 100% infalible; si detectamos un
            incidente que afecte tus datos, te lo notificaremos conforme a la normativa vigente.
          </p>
        </LegalSection>

        <LegalSection title="9. Cookies y almacenamiento local">
          <p>
            No usamos cookies de publicidad ni de rastreo. Para mantener tu sesión iniciada usamos almacenamiento
            local del navegador, no cookies.
          </p>
        </LegalSection>

        <LegalSection title="10. Menores de edad">
          <p>
            Wuarikes no está dirigido a menores de 18 años. Si eres padre, madre o apoderado y detectas que un menor
            nos proporcionó datos personales, escríbenos a{" "}
            <a href={`mailto:${LEGAL_PROVIDER.correo}`} className="text-primary hover:underline">
              {LEGAL_PROVIDER.correo}
            </a>{" "}
            para eliminarlos.
          </p>
        </LegalSection>

        <LegalSection title="11. Tus derechos (ARCO)">
          <p>
            Como titular de tus datos personales, tienes derecho a acceder a ellos, rectificarlos, cancelarlos y
            oponerte a su tratamiento, conforme a la Ley N.º 29733 y su reglamento. Puedes ejercer estos derechos
            escribiendo a{" "}
            <a href={`mailto:${LEGAL_PROVIDER.correo}`} className="text-primary hover:underline">
              {LEGAL_PROVIDER.correo}
            </a>
            , indicando tu solicitud y un medio para verificar tu identidad. Atenderemos tu pedido dentro de los
            plazos establecidos por la normativa vigente.
          </p>
        </LegalSection>

        <LegalSection title="12. Cambios a esta política">
          <p>
            Podemos actualizar esta Política de Privacidad para reflejar cambios en nuestros servicios, proveedores o
            la normativa aplicable. Publicaremos la versión vigente en esta misma página con su fecha de
            actualización.
          </p>
        </LegalSection>

        <LegalSection title="13. Contacto">
          <p>
            Para cualquier consulta sobre esta política o el tratamiento de tus datos, escríbenos a{" "}
            <a href={`mailto:${LEGAL_PROVIDER.correo}`} className="text-primary hover:underline">
              {LEGAL_PROVIDER.correo}
            </a>{" "}
            o usa nuestro{" "}
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
