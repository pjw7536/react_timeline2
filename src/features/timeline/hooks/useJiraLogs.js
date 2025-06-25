import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/services/api/client";

export const useJiraLogs = (eqpId) => {
  return useQuery({
    queryKey: ["logs", "jira", eqpId],
    queryFn: () =>
      apiClient("/logs/jira", {
        params: { eqpId },
      }),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 5,
  });
};
