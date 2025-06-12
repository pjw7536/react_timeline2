import React, { useMemo } from "react";
import BaseTimeline from "./BaseTimeline";
import { useEqpLogs } from "../hooks/useEqpLogs";
import { processData } from "../utils/timelineUtils";
import { makeGroupLabel } from "../utils/groupLabel";
import LoadingSpinner from "@/shared/LoadingSpinner";

export default function EqpTimeline({
  lineId,
  eqpId,
  range,
  showLegend,
  showTimeAxis = false,
  height = 10, // EQP는 단일 그룹이므로 낮은 높이
}) {
  const { data: eqpLogs = [], isLoading } = useEqpLogs(lineId, eqpId);

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
      title="⚙️ EQP 상태"
      showTimeAxis={showTimeAxis}
      height={height}
      minHeight={80}
      maxHeight={200}
      headerExtra={
        <span className="text-xs text-slate-500">{eqpLogs.length}개 로그</span>
      }
    />
  );
}
