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
        content: makeGroupLabel("JIRA", "JIRA", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
        order: 1,
      },
    ],
    [showLegend]
  );

  const items = useMemo(() => processData("JIRA", jiraLogs), [jiraLogs]);

  const options = useMemo(
    () => ({
      stack: false,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 60 * 1000,
      height: 80, // 추가
      minHeight: 80, // 추가
      maxHeight: 80, // 추가
      verticalScroll: false,
    }),
    [range]
  );

  return (
    <BaseTimeline
      groups={groups}
      items={items}
      options={options}
      title="📋 JIRA"
      showTimeAxis={showTimeAxis}
      headerExtra={
        <span className="text-xs text-slate-500">{jiraLogs.length}개 로그</span>
      }
    />
  );
}
