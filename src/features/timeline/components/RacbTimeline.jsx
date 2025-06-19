// src/features/timeline/components/RacbTimeline.jsx
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
        content: makeGroupLabel("RACB", "RACB"),
        className: "custom-group-label",
        order: 1,
      },
    ],
    []
  );

  const items = useMemo(() => processData("RACB", racbLogs), [racbLogs]);

  const options = useMemo(
    () => ({
      stack: false,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 60 * 1000,
      height: 100,
      minHeight: 30,
      maxHeight: 80,
      verticalScroll: false,
    }),
    [range]
  );

  // RACB 범례 항목
  const legendItems = [
    { state: "ALARM", color: "bg-red-600", label: "ALARM" },
    { state: "WARN", color: "bg-amber-600", label: "WARN" },
  ];

  return (
    <BaseTimeline
      groups={groups}
      items={items}
      options={options}
      title="🚨 RACB"
      showTimeAxis={showTimeAxis}
      headerExtra={
        <div>
          {/* 범례 - showLegend가 true일 때만 표시 */}
          {showLegend && (
            <div className="flex items-center gap-3 px-2">
              <div className="flex gap-3">
                {legendItems.map(({ state, color, label }) => (
                  <div key={state} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${color}`} />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
