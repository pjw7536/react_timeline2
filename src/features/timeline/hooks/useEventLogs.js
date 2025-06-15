import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useEventLogs = (lineId, eqpId) => {
  return useQuery({
    queryKey: ["logs", "event", lineId, eqpId],
    queryFn: () =>
      apiClient("/logs/event", {
        params: { lineId, eqpId },
      }),
    enabled: !!lineId && !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
