import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useTipLogs = (eqpId) => {
  return useQuery({
    queryKey: ["logs", "tip", eqpId],
    queryFn: () =>
      apiClient("/logs/tip", {
        params: { eqpId },
      }),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
