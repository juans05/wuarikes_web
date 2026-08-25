import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string | null;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  logout: () => void;
}

// Persistido en localStorage: el backend corre en un dominio distinto al
// frontend (Railway vs localhost/producción), así que las cookies httpOnly
// SameSite=Strict que setea el login nunca viajan en peticiones cross-origin.
// El token vive acá y se manda como Authorization: Bearer en cada request
// (ver src/api/client.ts) en vez de depender de la cookie.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: user !== null }),
      setTokens: (tokens) =>
        set({
          accessToken: tokens?.accessToken ?? null,
          refreshToken: tokens?.refreshToken ?? null,
        }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    { name: "wuarikes-auth" },
  ),
);
