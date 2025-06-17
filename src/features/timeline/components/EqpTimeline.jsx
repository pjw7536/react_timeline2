// src/features/timeline/components/EqpTimeline.jsx
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
      height: 100, // 고정 높이
      minHeight: 30,
      maxHeight: 80,
      verticalScroll: false, // 수직 스크롤 비활성화
      horizontalScroll: true,
      align: "top",

      // 줌 관련 설정 추가
      zoomFriction: 5,
    }),
    [range]
  );

  return (
    <BaseTimeline
      groups={groups}
      items={items}
      options={options}
      title="⚙️ EQP 상태"
      showTimeAxis={showTimeAxis}
      headerExtra={
        <span className="text-xs text-slate-500">{eqpLogs.length}개 로그</span>
      }
    />
  );
}
