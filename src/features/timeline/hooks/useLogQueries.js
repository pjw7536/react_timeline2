import { useQuery } from "@tanstack/react-query";
import { timelineApi } from "@/features/timeline/api/timelineApi";

/** 전체 로그 한 번에 */
export const useLogs = ({ lineId, sdwtId, eqpId }, enabled) =>
  useQuery({
    queryKey: ["logs", lineId, sdwtId, eqpId],
    queryFn: () => timelineApi.fetchLogs({ lineId, sdwtId, eqpId }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
