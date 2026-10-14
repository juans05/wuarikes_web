import { permanentRedirect } from "next/navigation";

// Una sola Política de Privacidad para todo Wuarikes (app de comensales y panel de negocios), así nunca se
// contradicen. Se publica en el panel; esta ruta se mantiene para los enlaces existentes.
export default function PoliticaPrivacidadPage() {
  permanentRedirect("https://admin.wuarikes.com/politica-de-privacidad");
}
