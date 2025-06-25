import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useEqpLogs = (eqpId) => {
  return useQuery({
    queryKey: ["logs", "eqp", eqpId],
    queryFn: () =>
      apiClient("/logs/eqp", {
        params: { eqpId },
      }),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
