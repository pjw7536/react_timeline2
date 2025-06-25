import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useRacbLogs = (eqpId) => {
  return useQuery({
    queryKey: ["logs", "racb", eqpId],
    queryFn: () =>
      apiClient("/logs/racb", {
        params: { eqpId },
      }),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
