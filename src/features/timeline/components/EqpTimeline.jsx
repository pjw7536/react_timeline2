import React, { useMemo } from "react";
import BaseTimeline from "./BaseTimeline";
import { processData } from "../utils/timelineUtils";
import { makeGroupLabel } from "../utils/groupLabel";

export default function EqpTimeline({
  lineId,
  eqpId,
  range,
  showLegend,
  showTimeAxis = false,
  height,
  eqpLogs = [],
}) {
  const groups = useMemo(
    () => [
      {
        id: "EQP",
        content: makeGroupLabel("EQP", "EQP 로그", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
        order: 1,
      },
    ],
    [showLegend]
  );

  const items = useMemo(() => processData("EQP", eqpLogs, true), [eqpLogs]);

  const options = useMemo(
    () => ({
      stack: false,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 60 * 1000,
      height: height,
      verticalScroll: false,
      align: "center",
    }),
    [range, height]
  );

  return (
    <BaseTimeline
      groups={groups}
      items={items}
      options={options}
      title="⚙️ EQP 상태"
      showTimeAxis={showTimeAxis}
      height={height}
      headerExtra={
        <span className="text-xs text-slate-500">{eqpLogs.length}개 로그</span>
      }
    />
  );
}
