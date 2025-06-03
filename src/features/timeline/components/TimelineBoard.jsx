import React, { useMemo } from "react";
import NonStackedTimeline from "./NonStackedTimeline";
import StackedTimeline from "./StackedTimeline";
import { calcRange, addBuffer } from "@/features/timeline/utils/timelineUtils";

export default function TimelineBoard({ dataMap }) {
  const eqpLogArr = dataMap.EQP || [];
  const tipLogArr = dataMap.TIP || [];
  const ctttmLogArr = dataMap.CTTTM || [];
  const racbLogArr = dataMap.RACB || [];

  const allLogs = useMemo(
    () => [...eqpLogArr, ...tipLogArr, ...ctttmLogArr, ...racbLogArr],
    [eqpLogArr, tipLogArr, ctttmLogArr, racbLogArr]
  );

  const fullRange = useMemo(() => {
    const r = calcRange(allLogs);
    return addBuffer(r.min.getTime(), r.max.getTime());
  }, [allLogs]);

  return (
    <div className="w-full space-y-4">
      <NonStackedTimeline
        dataMap={{ EQP: eqpLogArr, TIP: tipLogArr }}
        range={fullRange}
      />
      <StackedTimeline dataMap={{ CTTTM: ctttmLogArr, RACB: racbLogArr }} />
    </div>
  );
}
