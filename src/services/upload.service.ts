import { apiClient } from "@/api/client";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<{ url: string; publicId: string }>(
    "/upload/image",
    formData,
  );
  return data.url;
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<{ url: string; publicId: string }>(
    "/upload/document",
    formData,
  );
  return data.url;
}

export async function uploadVideo(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<{ url: string; publicId: string }>(
    "/upload/video",
    formData,
  );
  return data.url;
}
