import React, { useMemo } from "react";
import BaseTimeline from "./BaseTimeline";
import { useEventLogs } from "../hooks/useEventLogs";
import { processData } from "../utils/timelineUtils";
import { makeGroupLabel } from "../utils/groupLabel";
import LoadingSpinner from "@/shared/LoadingSpinner";

// CTTTM, RACB, JIRA를 하나로 묶은 이벤트 타임라인
export default function EventTimeline({
  lineId,
  eqpId,
  range,
  showLegend,
  showTimeAxis = true,
}) {
  // 이벤트 로그들을 한번에 가져오기
  const { data: eventLogs = [], isLoading } = useEventLogs(lineId, eqpId);

  const groups = useMemo(
    () => [
      {
        id: "CTTTM",
        content: makeGroupLabel("CTTTM", "CTTTM", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
        order: 1,
      },
      {
        id: "RACB",
        content: makeGroupLabel("RACB", "RACB", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
        order: 2,
      },
      {
        id: "JIRA",
        content: makeGroupLabel("JIRA", "JIRA", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
        order: 3,
      },
    ],
    [showLegend]
  );

  const items = useMemo(() => {
    const ctttmItems = processData(
      "CTTTM",
      eventLogs.filter((l) => l.logType === "CTTTM")
    );
    const racbItems = processData(
      "RACB",
      eventLogs.filter((l) => l.logType === "RACB")
    );
    const jiraItems = processData(
      "JIRA",
      eventLogs.filter((l) => l.logType === "JIRA")
    );

    return [...ctttmItems, ...racbItems, ...jiraItems];
  }, [eventLogs]);

  const options = useMemo(
    () => ({
      stack: true,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 60 * 1000,
      height: 200,
    }),
    [range]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <BaseTimeline
      groups={groups}
      items={items}
      options={options}
      title="📍 이벤트 로그"
      showTimeAxis={showTimeAxis}
      style={{ height: "200px" }}
    />
  );
}
