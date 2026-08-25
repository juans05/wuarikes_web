import { useQuery } from "@tanstack/react-query";
import { getMyFollowers, getMyFollowing } from "@/services/users.service";

export function useMyFollowers(enabled = true) {
  return useQuery({
    queryKey: ["me", "followers"],
    queryFn: () => getMyFollowers(),
    enabled,
    retry: false,
  });
}

export function useMyFollowing(enabled = true) {
  return useQuery({
    queryKey: ["me", "following"],
    queryFn: () => getMyFollowing(),
    enabled,
    retry: false,
  });
}
