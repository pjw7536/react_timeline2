import { useMemo } from "react";
import { useEqpLogs } from "./useEqpLogs";
import { useTipLogs } from "./useTipLogs";
import { useEventLogs } from "./useEventLogs";
import { calcRange, addBuffer } from "../utils/timelineUtils";

/**
 * 모든 타임라인의 데이터를 고려하여 전체 범위를 계산하는 훅
 */
export function useTimelineRange(lineId, eqpId) {
  const { data: eqpLogs = [] } = useEqpLogs(lineId, eqpId);
  const { data: tipLogs = [] } = useTipLogs(lineId, eqpId);
  const { data: eventLogs = [] } = useEventLogs(lineId, eqpId);

  const range = useMemo(() => {
    // 모든 로그를 합쳐서 범위 계산
    const allLogs = [...eqpLogs, ...tipLogs, ...eventLogs];

    if (allLogs.length === 0) {
      // 로그가 없을 때 기본 범위 (오늘 하루)
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );
      return addBuffer(startOfToday.getTime(), endOfToday.getTime());
    }

    const { min, max } = calcRange(allLogs);
    return addBuffer(min.getTime(), max.getTime());
  }, [eqpLogs, tipLogs, eventLogs]);

  return range;
}
