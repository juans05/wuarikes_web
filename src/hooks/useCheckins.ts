import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDish,
  createCheckin,
  getCheckinsFeed,
  likeCheckin,
  unlikeCheckin,
  type CheckinsFeedQuery,
} from "@/services/checkins.service";

export function useCheckinsFeed(query: CheckinsFeedQuery) {
  return useQuery({
    queryKey: ["checkins", "feed", query],
    queryFn: () => getCheckinsFeed(query),
  });
}

export function useCreateCheckin(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCheckin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkins", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["place", placeId] });
    },
  });
}

export function useAddDish(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ checkinId, dishName, dishPrice }: { checkinId: string; dishName: string; dishPrice?: number }) =>
      addDish(checkinId, dishName, dishPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["top-dishes", placeId] });
    },
  });
}

export function useLikeCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) =>
      liked ? unlikeCheckin(id) : likeCheckin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkins", "feed"] });
    },
  });
}
