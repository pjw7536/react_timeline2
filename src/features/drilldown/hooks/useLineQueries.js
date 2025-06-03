import { useQuery } from "@tanstack/react-query";
import { timelineApi } from "@/features/timeline/api/timelineApi";

// ① 라인 목록 (언제나 요청)
export const useLines = () =>
  useQuery({
    queryKey: ["lines"], // 캐시 키
    queryFn: timelineApi.fetchLines,
    staleTime: 1000 * 60 * 30, // 30분 → fresh 판정
  });

// ② SDWT 목록 (lineId 가 있어야 동작)
export const useSDWT = (lineId) =>
  useQuery({
    queryKey: ["sdwts", lineId],
    queryFn: () => timelineApi.fetchSDWT(lineId),
    enabled: !!lineId, // ← false면 요청 자체를 안 보냄
    staleTime: 1000 * 60 * 30,
  });

// ③ EQP 목록 (line + sdwt 모두 골랐을 때만)
export const useEquipments = (lineId, sdwtId) =>
  useQuery({
    queryKey: ["equipments", lineId, sdwtId],
    queryFn: () => timelineApi.fetchEquipments(lineId, sdwtId),
    enabled: !!lineId && !!sdwtId,
    staleTime: 1000 * 60 * 30,
  });
