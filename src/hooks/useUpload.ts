import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/upload.service";

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
  });
}
