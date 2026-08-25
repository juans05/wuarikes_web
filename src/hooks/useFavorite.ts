import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { addFavorite, isFavorite, removeFavorite } from "@/services/favorites.service";

export function useFavorite(placeId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["favorite", placeId],
    queryFn: () => isFavorite(placeId),
    enabled: isAuthenticated,
  });

  const mutation = useMutation({
    mutationFn: () =>
      query.data ? removeFavorite(placeId) : addFavorite(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", placeId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    isFavorite: query.data ?? false,
    isAuthenticated,
    toggle: mutation.mutate,
    isPending: mutation.isPending,
  };
}
