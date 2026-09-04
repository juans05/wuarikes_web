import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { addInterest, getInterest, removeInterest } from "@/services/interest.service";

export function useInterest(placeId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["interest", placeId],
    queryFn: () => getInterest(placeId),
    enabled: isAuthenticated,
  });

  const mutation = useMutation({
    mutationFn: () =>
      query.data?.isInterested ? removeInterest(placeId) : addInterest(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interest", placeId] });
    },
  });

  return {
    isInterested: query.data?.isInterested ?? false,
    count: query.data?.count ?? 0,
    isAuthenticated,
    toggle: mutation.mutate,
    isPending: mutation.isPending,
  };
}
