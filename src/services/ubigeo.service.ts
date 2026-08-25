import { apiClient } from "@/api/client";

export async function getDepartments() {
  const { data } = await apiClient.get<string[]>("/ubigeo/departments");
  return data;
}

export async function getProvinces(department: string) {
  const { data } = await apiClient.get<string[]>("/ubigeo/provinces", {
    params: { department },
  });
  return data;
}

export async function getDistricts(department: string, province: string) {
  const { data } = await apiClient.get<{ district: string }[]>(
    "/ubigeo/districts",
    { params: { department, province } },
  );
  return data.map((d) => d.district);
}
