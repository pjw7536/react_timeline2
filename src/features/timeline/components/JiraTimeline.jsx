// src/features/timeline/components/JiraTimeline.jsx
import React, { useMemo } from "react";
import BaseTimeline from "./BaseTimeline";
import { processData } from "../utils/timelineUtils";
import { makeGroupLabel } from "../utils/groupLabel";

export default function JiraTimeline({
  lineId,
  eqpId,
  range,
  showLegend,
  showTimeAxis = false,
  jiraLogs = [],
}) {
  const groups = useMemo(
    () => [
      {
        id: "JIRA",
        content: makeGroupLabel("JIRA", "JIRA"),
        className: "custom-group-label",
        order: 1,
      },
    ],
    []
  );

  const items = useMemo(() => processData("JIRA", jiraLogs), [jiraLogs]);

  const options = useMemo(
    () => ({
      stack: false,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 60 * 1000,
      height: 80,
      minHeight: 80,
      maxHeight: 80,
      verticalScroll: false,
    }),
    [range]
  );

  // JIRA 범례 항목
  const legendItems = [
    { state: "ISSUED", color: "bg-blue-600", label: "ISSUED" },
    { state: "CLOSED", color: "bg-purple-600", label: "CLOSED" },
  ];

  return (
    <BaseTimeline
      groups={groups}
      items={items}
      options={options}
      title="📋 JIRA"
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
