import { useMutation } from "@tanstack/react-query";
import { uploadImage, uploadDocument } from "@/services/upload.service";

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
  });
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: uploadDocument,
  });
}
