import { useQuery } from "@tanstack/react-query";
import { getBadges } from "@/services/users.service";

export function useGamificationBadges(enabled = true) {
  return useQuery({
    queryKey: ["me", "badges"],
    queryFn: getBadges,
    enabled,
    retry: false,
  });
}
