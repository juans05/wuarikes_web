import { apiClient } from "@/api/client";
import { useAuthStore } from "@/stores/auth.store";
import type { Session } from "@/types/session";

interface AuthUserResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthResponse {
  user: AuthUserResponse;
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function register(email: string, password: string, fullName: string) {
  const { data } = await apiClient.post<{ message: string }>("/auth/register", {
    email,
    password,
    fullName,
  });
  return data;
}

export async function verifyEmail(email: string, code: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/verify-email", {
    email,
    code,
  });
  return data;
}

export async function resendCode(email: string) {
  const { data } = await apiClient.post<{ message: string }>("/auth/resend-code", {
    email,
  });
  return data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function forgotPassword(email: string) {
  const { data } = await apiClient.post<{ message: string }>(
    "/auth/forgot-password",
    { email },
  );
  return data;
}

export async function resetPassword(email: string, code: string, password: string) {
  const { data } = await apiClient.post<{ message: string }>(
    "/auth/reset-password",
    { email, code, password },
  );
  return data;
}

export async function getSessions() {
  const refreshToken = useAuthStore.getState().refreshToken;
  const { data } = await apiClient.post<Session[]>("/auth/sessions", { refreshToken });
  return data;
}

export async function revokeSession(id: string) {
  await apiClient.post(`/auth/sessions/${id}/revoke`);
}

export async function revokeOtherSessions() {
  const refreshToken = useAuthStore.getState().refreshToken;
  await apiClient.post("/auth/sessions/revoke-others", { refreshToken });
}

export async function socialLogin(params: {
  provider: "google" | "facebook";
  token: string;
  email?: string;
  name?: string;
  photoUrl?: string;
}) {
  const { data } = await apiClient.post<AuthResponse>("/auth/social-login", params);
  return data;
}
