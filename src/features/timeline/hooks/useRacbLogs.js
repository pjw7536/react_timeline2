import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useRacbLogs = (lineId, eqpId) => {
  return useQuery({
    queryKey: ["logs", "racb", lineId, eqpId],
    queryFn: () =>
      apiClient("/logs/racb", {
        params: { lineId, eqpId },
      }),
    enabled: !!lineId && !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
