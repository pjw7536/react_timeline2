import React, { useMemo, useRef } from "react";
import { processData } from "@/features/timeline/utils/timelineUtils";
import { makeGroupLabel } from "@/features/timeline/utils/groupLabel";
import { useVisTimeline } from "../hooks/useVisTimeline";

/**
 * CTTTM_LOG + RACB_LOG + JIRA 를 stack=true 로 보여주는 타임라인
 */
export default function StackedTimeline({ dataMap, range, showLegend }) {
  // vis-timeline 이 그려질 DOM 요소 ref
  const containerRef = useRef(null);

  // 그룹(CTTTM, RACB, JIRA) 정의
  const groups = useMemo(
    () => [
      {
        id: "CTTTM",
        content: makeGroupLabel("CTTTM", "CTTTM 로그", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
      },
      {
        id: "RACB",
        content: makeGroupLabel("RACB", "RACB 로그", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
      },
      {
        id: "JIRA",
        content: makeGroupLabel("JIRA", "JIRA 로그", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
      },
    ],
    [showLegend]
  );

  // 타임라인에 표시할 아이템 배열
  const items = useMemo(
    () => groups.flatMap((g) => processData(g.id, dataMap[g.id] || [])),
    [dataMap, groups]
  );

  // vis-timeline 옵션 정의 - 외부에서 전달받은 range 사용
  const options = useMemo(
    () => ({
      stack: true,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 1000,
      verticalScroll: true,
      groupHeightMode: "fixed",
      groupOrder: (a, b) =>
        ["CTTTM", "RACB", "JIRA"].indexOf(a.id) -
        ["CTTTM", "RACB", "JIRA"].indexOf(b.id),
    }),
    [range]
  );

  // 커스텀 훅으로 vis-timeline 생성 및 업데이트 처리
  useVisTimeline({ containerRef, groups, items, options });

  return (
    <div className="timeline-container">
      <h3 className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
        📍 변경점 로그
      </h3>
      {/* 실제 타임라인이 렌더링될 영역 */}
      <div
        ref={containerRef}
        className="timeline"
        style={{ height: "650px", overflow: "hidden" }}
      />
    </div>
  );
}
