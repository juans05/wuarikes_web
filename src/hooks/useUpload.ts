import { useMutation } from "@tanstack/react-query";
import { uploadImage, uploadDocument, uploadVideo } from "@/services/upload.service";

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

export function useUploadVideo() {
  return useMutation({
    mutationFn: uploadVideo,
  });
}
