// Accesos reales para dueños de negocio: el alta se hace por WhatsApp con ventas
// (demo y cierre) y la gestión en el panel. Mismo número que la landing del panel.
export const PANEL_URL = "https://admin.wuarikes.com";
export const PANEL_LOGIN_URL = `${PANEL_URL}/login`;

const WHATSAPP_SALES = "51902191948";

export const salesWhatsApp = (
  message = "Hola equipo Wuarikes, quiero registrar mi negocio y ver una demo.",
) => `https://wa.me/${WHATSAPP_SALES}?text=${encodeURIComponent(message)}`;
