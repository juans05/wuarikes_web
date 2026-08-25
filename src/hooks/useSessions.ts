import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSessions, revokeOtherSessions, revokeSession } from "@/services/auth.service";

export function useSessions() {
  return useQuery({
    queryKey: ["me", "sessions"],
    queryFn: getSessions,
    retry: false,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "sessions"] });
    },
  });
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "sessions"] });
    },
  });
}
