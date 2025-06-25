import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useCtttmLogs = (eqpId) => {
  return useQuery({
    queryKey: ["logs", "ctttm", eqpId],
    queryFn: () =>
      apiClient("/logs/ctttm", {
        params: { eqpId },
      }),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
