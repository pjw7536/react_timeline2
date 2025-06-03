import { apiClient } from "@/shared/apiClient";

export const timelineApi = {
  // “라인 목록” 엔드포인트
  fetchLines: () => apiClient("/lines"),
  // 필요 파라미터는 params 객체로
  fetchSDWT: (lineId) => apiClient("/sdwts", { params: { lineId } }),
  fetchEquipments: (l, s) =>
    apiClient("/equipments", { params: { lineId: l, sdwtId: s } }),
  fetchLogs: ({ lineId, sdwtId, eqpId }) =>
    apiClient("/logs", { params: { lineId, sdwtId, eqpId } }),
};
