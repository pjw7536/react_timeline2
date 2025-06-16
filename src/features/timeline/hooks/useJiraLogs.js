import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useJiraLogs = (lineId, eqpId) => {
  return useQuery({
    queryKey: ["logs", "jira", lineId, eqpId],
    queryFn: () =>
      apiClient("/logs/jira", {
        params: { lineId, eqpId },
      }),
    enabled: !!lineId && !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
