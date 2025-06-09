// src/features/timeline/hooks/useLogQueries.js
import { useQuery } from "@tanstack/react-query";
import { timelineApi } from "@/features/timeline/api/timelineApi";

export const useLogs = ({ lineId, eqpId }, enabled) =>
  useQuery({
    queryKey: ["logs", lineId, eqpId],
    queryFn: () => timelineApi.fetchLogs({ lineId, eqpId }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
