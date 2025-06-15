import { apiClient } from "@shared/services/api/client";

export const timelineApi = {
  // "라인 목록" 엔드포인트
  fetchLines: () => apiClient("/lines"),

  // SDWT 목록
  fetchSDWT: (lineId) => apiClient("/sdwts", { params: { lineId } }),

  // PRC Group 목록
  fetchPrcGroups: (lineId, sdwtId) =>
    apiClient("/prc-groups", { params: { lineId, sdwtId } }),

  // Equipment 목록
  fetchEquipments: (lineId, sdwtId, prcGroup) => {
    const params = { lineId };
    if (sdwtId) params.sdwtId = sdwtId;
    if (prcGroup) params.prcGroup = prcGroup;
    return apiClient("/equipments", { params });
  },

  // 로그 가져오기 - sdwtId 제거
  fetchLogs: ({ lineId, eqpId }) =>
    apiClient("/logs", { params: { lineId, eqpId } }),

  // EQP 정보 조회
  fetchEquipmentInfo: (lineId, eqpId) =>
    apiClient(`/equipment-info/${lineId}/${eqpId}`),
};
