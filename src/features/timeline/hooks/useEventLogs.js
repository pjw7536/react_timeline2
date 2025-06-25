import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useEventLogs = (eqpId) => {
  return useQuery({
    queryKey: ["logs", "event", eqpId],
    queryFn: () =>
      apiClient("/logs/event", {
        params: { eqpId },
      }),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
