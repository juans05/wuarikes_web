import { useQuery } from "@tanstack/react-query";
import { getMyLoyaltyCards } from "@/services/loyalty.service";
import { useAuthStore } from "@/stores/auth.store";

export function useMyLoyaltyCards() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["loyalty", "my-cards"],
    queryFn: getMyLoyaltyCards,
    enabled: isAuthenticated,
  });
}
