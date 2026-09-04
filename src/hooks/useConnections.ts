import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  followUser,
  getFollowStatus,
  getMyFollowers,
  getMyFollowing,
  getPublicProfile,
  unfollowUser,
} from "@/services/users.service";
import { useAuthStore } from "@/stores/auth.store";

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

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId, "public-profile"],
    queryFn: () => getPublicProfile(userId),
    enabled: Boolean(userId),
  });
}

export function useFollow(userId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user", userId, "follow-status"],
    queryFn: () => getFollowStatus(userId),
    enabled: isAuthenticated && Boolean(userId),
  });

  const mutation = useMutation({
    mutationFn: () => (query.data?.isFollowing ? unfollowUser(userId) : followUser(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId, "follow-status"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId, "public-profile"] });
    },
  });

  return {
    isFollowing: query.data?.isFollowing ?? false,
    isAuthenticated,
    toggle: mutation.mutate,
    isPending: mutation.isPending,
  };
}
