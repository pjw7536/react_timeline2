import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/apiClient";

export const useEqpLogs = (lineId, eqpId) => {
  return useQuery({
    queryKey: ["logs", "eqp", lineId, eqpId],
    queryFn: () =>
      apiClient("/logs/eqp", {
        params: { lineId, eqpId },
      }),
    enabled: !!lineId && !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
