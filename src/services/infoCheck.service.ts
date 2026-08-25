import { apiClient } from "@/api/client";

export type PlaceInfoField =
  | "phone"
  | "address"
  | "menu"
  | "hours"
  | "name"
  | "website"
  | "category"
  | "amenities";

export interface SubmitInfoSuggestionInput {
  placeId: string;
  field: PlaceInfoField;
  suggestedValue?: string;
}

export interface SubmitInfoSuggestionResponse {
  votes: number;
  applied: boolean;
}

export async function submitInfoSuggestion(input: SubmitInfoSuggestionInput) {
  const { data } = await apiClient.post<SubmitInfoSuggestionResponse>(
    "/checkins/info-suggestions",
    input,
  );
  return data;
}
