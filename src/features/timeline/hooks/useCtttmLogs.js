import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useCtttmLogs = (lineId, eqpId) => {
  return useQuery({
    queryKey: ["logs", "ctttm", lineId, eqpId],
    queryFn: () =>
      apiClient("/logs/ctttm", {
        params: { lineId, eqpId },
      }),
    enabled: !!lineId && !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
