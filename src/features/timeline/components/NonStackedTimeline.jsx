import React, { useMemo, useRef } from "react";
import { processData } from "@/features/timeline/utils/timelineUtils";
import { makeGroupLabel } from "@/features/timeline/utils/groupLabel";
import { useVisTimeline } from "../hooks/useVisTimeline";

export default function NonStackedTimeline({ dataMap, range, showLegend }) {
  // 타임라인 DOM 노드를 위한 ref
  const containerRef = useRef(null);

  // 그룹(EQP, TIP) 정의
  const groups = useMemo(
    () => [
      {
        id: "EQP",
        content: makeGroupLabel("EQP", "EQP 로그", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
      },
      {
        id: "TIP",
        content: makeGroupLabel("TIP", "TIP 로그", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
      },
    ],
    [showLegend]
  );

  // 타임라인에 표시할 아이템 목록 생성
  const items = useMemo(
    () => ["EQP", "TIP"].flatMap((id) => processData(id, dataMap[id] || [])),
    [dataMap]
  );

  // vis-timeline 옵션 설정
  const options = useMemo(
    () => ({
      stack: false,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 1000,
      margin: { item: 0, axis: 0 },
      groupOrder: (a, b) =>
        ["EQP", "TIP"].indexOf(a.id) - ["EQP", "TIP"].indexOf(b.id),
      selectable: true,
    }),
    [range]
  );

  // 커스텀 훅을 통해 타임라인 생성 및 업데이트
  useVisTimeline({ containerRef, groups, items, options });

  return (
    <div className="timeline-container relative">
      <h3 className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
        ⛓ EQP + TIP 로그
      </h3>
      {/* 실제 타임라인이 그려질 영역 */}
      <div ref={containerRef} className="timeline" />
    </div>
  );
}
