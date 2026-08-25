import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback = "Algo salió mal. Intenta de nuevo.") {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message) && message.length > 0) return message[0];
  }
  return fallback;
}
