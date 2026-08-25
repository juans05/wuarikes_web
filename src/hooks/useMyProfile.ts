import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/services/users.service";

export function useMyProfile(enabled = true) {
  return useQuery({
    queryKey: ["me", "profile"],
    queryFn: getMyProfile,
    enabled,
    retry: false,
  });
}
