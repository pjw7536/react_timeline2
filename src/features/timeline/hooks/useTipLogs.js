import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useTipLogs = (lineId, eqpId) => {
  return useQuery({
    queryKey: ["logs", "tip", lineId, eqpId],
    queryFn: () =>
      apiClient("/logs/tip", {
        params: { lineId, eqpId },
      }),
    enabled: !!lineId && !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
