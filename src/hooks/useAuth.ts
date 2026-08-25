import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: ({ user, accessToken, refreshToken }) => {
      setTokens({ accessToken, refreshToken });
      setUser(user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName: string;
    }) => authService.register(email, password, fullName),
  });
}

export function useVerifyEmail() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authService.verifyEmail(email, code),
    onSuccess: ({ user, accessToken, refreshToken }) => {
      setTokens({ accessToken, refreshToken });
      setUser(user);
    },
  });
}

export function useResendCode() {
  return useMutation({
    mutationFn: (email: string) => authService.resendCode(email),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      email,
      code,
      password,
    }: {
      email: string;
      code: string;
      password: string;
    }) => authService.resetPassword(email, code, password),
  });
}

export function useSocialLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation({
    mutationFn: authService.socialLogin,
    onSuccess: ({ user, accessToken, refreshToken }) => {
      setTokens({ accessToken, refreshToken });
      setUser(user);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}
