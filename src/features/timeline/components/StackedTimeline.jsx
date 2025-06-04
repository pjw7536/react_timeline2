import React, { useMemo, useRef } from "react";
import {
  processData,
  calcRange,
  addBuffer,
} from "@/features/timeline/utils/timelineUtils";
import { makeGroupLabel } from "@/features/timeline/utils/groupLabel";
import { useVisTimeline } from "../hooks/useVisTimeline";

/**
 * CTTTM_LOG + RACB_LOG 를 stack=true 로 보여주는 타임라인
 */
export default function StackedTimeline({ dataMap, showLegend }) {
  // vis-timeline 이 그려질 DOM 요소 ref
  const containerRef = useRef(null);

  // 그룹(CTTTM, RACB) 정의
  const groups = useMemo(
    () => [
      {
        id: "CTTTM",
        content: makeGroupLabel("CTTTM", "CTTTM 이벤트", showLegend),
        height: 150,
        style: "height: 200px", // ← 꼭 추가!
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
      },
      {
        id: "RACB",
        content: makeGroupLabel("RACB", "RACB 이벤트", showLegend),
        height: 150,
        style: "height: 200px", // ← 꼭 추가!
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
      },
    ],
    [showLegend]
  );

  // 전체 로그의 범위를 계산하고 좌우에 버퍼를 준다
  const range = useMemo(() => {
    const all = [...(dataMap.CTTTM || []), ...(dataMap.RACB || [])];
    const { min, max } = calcRange(all);
    return addBuffer(min.getTime(), max.getTime());
  }, [dataMap]);

  // 타임라인에 표시할 아이템 배열
  const items = useMemo(
    () => groups.flatMap((g) => processData(g.id, dataMap[g.id] || [])),
    [dataMap, groups]
  );

  // vis-timeline 옵션 정의
  const options = useMemo(
    () => ({
      stack: true,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 1000,
      verticalScroll: true,
      groupHeightMode: "fixed",
      groupHeights: { CTTTM: 200, RACB: 200 },
      groupOrder: (a, b) =>
        ["CTTTM", "RACB"].indexOf(a.id) - ["CTTTM", "RACB"].indexOf(b.id),
    }),
    [range]
  );

  // 커스텀 훅으로 vis-timeline 생성 및 업데이트 처리
  useVisTimeline({ containerRef, groups, items, options });

  return (
    <div className="timeline-container">
      <h3 className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
        📍 CTTTM + RACB 로그
      </h3>
      {/* 실제 타임라인이 렌더링될 영역 */}
      <div
        ref={containerRef}
        className="timeline"
        style={{ height: "550px", overflow: "hidden" }}
      />
    </div>
  );
}
