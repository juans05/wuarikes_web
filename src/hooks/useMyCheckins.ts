import { useQuery } from "@tanstack/react-query";
import { getMyCheckins } from "@/services/users.service";

export function useMyCheckins(enabled = true) {
  return useQuery({
    queryKey: ["me", "checkins"],
    queryFn: () => getMyCheckins(1, 30),
    enabled,
    retry: false,
  });
}
