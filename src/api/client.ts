import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  withCredentials: true,
});

// El backend corre en un dominio distinto al frontend (Railway vs
// localhost/producción) — las cookies httpOnly SameSite=Strict que setea el
// login nunca viajan en peticiones cross-origin, así que la autenticación
// real va por este header, con el token guardado en el store (ver
// stores/auth.store.ts). withCredentials se deja por si algún día ambos
// quedan en el mismo dominio.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const REFRESH_PATH = "/auth/refresh";
let refreshPromise: Promise<unknown> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest?.url?.startsWith("/auth/");

    if (error.response?.status === 401 && !isAuthRoute && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshPromise ??= apiClient
          .post<{ accessToken: string; refreshToken: string }>(REFRESH_PATH, {
            refreshToken: useAuthStore.getState().refreshToken,
          })
          .then(({ data }) => {
            useAuthStore.getState().setTokens(data);
          })
          .finally(() => {
            refreshPromise = null;
          });
        await refreshPromise;
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
