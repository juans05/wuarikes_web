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
