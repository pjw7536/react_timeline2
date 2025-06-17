import React, { useMemo } from "react";
import BaseTimeline from "./BaseTimeline";
import { processData } from "../utils/timelineUtils";
import { makeGroupLabel } from "../utils/groupLabel";

export default function RacbTimeline({
  lineId,
  eqpId,
  range,
  showLegend,
  showTimeAxis = false,
  racbLogs = [],
}) {
  const groups = useMemo(
    () => [
      {
        id: "RACB",
        content: makeGroupLabel("RACB", "RACB", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
        order: 1,
      },
    ],
    [showLegend]
  );

  const items = useMemo(() => processData("RACB", racbLogs), [racbLogs]);

  const options = useMemo(
    () => ({
      stack: false,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 60 * 1000,
      height: 100, // 고정 높이
      minHeight: 30,
      maxHeight: 80,
      verticalScroll: false,
    }),
    [range]
  );

  return (
    <BaseTimeline
      groups={groups}
      items={items}
      options={options}
      title="🚨 RACB"
      showTimeAxis={showTimeAxis}
      headerExtra={
        <span className="text-xs text-slate-500">{racbLogs.length}개 로그</span>
      }
    />
  );
}
