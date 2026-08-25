import { useQuery } from "@tanstack/react-query";
import { getDepartments, getDistricts, getProvinces } from "@/services/ubigeo.service";

export function useDepartments() {
  return useQuery({ queryKey: ["ubigeo", "departments"], queryFn: getDepartments });
}

export function useProvinces(department: string | null) {
  return useQuery({
    queryKey: ["ubigeo", "provinces", department],
    queryFn: () => getProvinces(department!),
    enabled: Boolean(department),
  });
}

export function useDistricts(department: string | null, province: string | null) {
  return useQuery({
    queryKey: ["ubigeo", "districts", department, province],
    queryFn: () => getDistricts(department!, province!),
    enabled: Boolean(department && province),
  });
}
