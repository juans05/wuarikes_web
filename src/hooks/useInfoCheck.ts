import { useMutation } from "@tanstack/react-query";
import { submitInfoSuggestion } from "@/services/infoCheck.service";

export function useSubmitInfoSuggestion() {
  return useMutation({ mutationFn: submitInfoSuggestion });
}
