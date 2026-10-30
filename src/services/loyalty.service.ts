import { apiClient } from "@/api/client";

export interface MyLoyaltyCard {
  placeId: string;
  placeName: string;
  placeCoverImageUrl: string | null;
  programType: "stamps" | "points";
  stamps: number;
  points: number;
  stampsToReward: number | null;
  stampsRemaining: number | null;
  level: string;
  rewardTitle: string;
}

export async function getMyLoyaltyCards() {
  const { data } = await apiClient.get<MyLoyaltyCard[]>("/loyalty/my-cards");
  return data;
}
