// src/features/timeline/components/TimelineBoard.jsx
import React, { useMemo } from "react";
import NonStackedTimeline from "./NonStackedTimeline";
import StackedTimeline from "./StackedTimeline";
import { calcRange, addBuffer } from "@/features/timeline/utils/timelineUtils";

export default function TimelineBoard({
  dataMap,
  showLegend,
  selectedTipGroups,
}) {
  const eqpLogArr = dataMap.EQP || [];
  const tipLogArr = dataMap.TIP || [];
  const ctttmLogArr = dataMap.CTTTM || [];
  const racbLogArr = dataMap.RACB || [];
  const jiraLogArr = dataMap.JIRA || [];

  const allLogs = useMemo(
    () => [
      ...eqpLogArr,
      ...tipLogArr,
      ...ctttmLogArr,
      ...racbLogArr,
      ...jiraLogArr,
    ],
    [eqpLogArr, tipLogArr, ctttmLogArr, racbLogArr, jiraLogArr]
  );

  const fullRange = useMemo(() => {
    const r = calcRange(allLogs);
    return addBuffer(r.min.getTime(), r.max.getTime());
  }, [allLogs]);

  // 범위 디버깅 (선택사항)
  console.log("Timeline Range:", {
    min: fullRange.min.toISOString(),
    max: fullRange.max.toISOString(),
    logCount: allLogs.length,
    selectedTipGroups: selectedTipGroups, // 디버깅용
  });

  return (
    <div className="w-full space-y-4">
      <NonStackedTimeline
        dataMap={{ EQP: eqpLogArr, TIP: tipLogArr }}
        range={fullRange}
        showLegend={showLegend}
        selectedTipGroups={selectedTipGroups}
      />
      <StackedTimeline
        dataMap={{ CTTTM: ctttmLogArr, RACB: racbLogArr, JIRA: jiraLogArr }}
        range={fullRange}
        showLegend={showLegend}
      />
    </div>
  );
}
