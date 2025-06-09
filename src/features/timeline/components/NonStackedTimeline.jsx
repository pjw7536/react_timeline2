import React, { useMemo, useRef } from "react";
import { processData } from "@/features/timeline/utils/timelineUtils";
import {
  makeGroupLabel,
  makeTipGroupLabel,
} from "@/features/timeline/utils/groupLabel";
import { useVisTimeline } from "../hooks/useVisTimeline";

export default function NonStackedTimeline({
  dataMap,
  range,
  showLegend,
  selectedTipGroups,
}) {
  const containerRef = useRef(null);

  // 필터링된 TIP 로그
  const filteredTipLogs = useMemo(() => {
    if (!dataMap.TIP) return [];

    // 선택된 그룹이 없으면 빈 배열 반환 (TIP 로그 숨김)
    if (!selectedTipGroups || selectedTipGroups.length === 0) return [];

    // 특별한 값 "__ALL__"이 포함되어 있으면 전체 표시
    if (selectedTipGroups.includes("__ALL__")) return dataMap.TIP;

    return dataMap.TIP.filter((log) => {
      const groupKey = `${log.process || "unknown"}_${log.step || "unknown"}_${
        log.ppid || "unknown"
      }`;
      return selectedTipGroups.includes(groupKey);
    });
  }, [dataMap.TIP, selectedTipGroups]);

  // TIP 그룹 동적 생성 (필터링된 로그 기반)
  const tipGroups = useMemo(() => {
    const groupMap = new Map();

    filteredTipLogs.forEach((log) => {
      const groupKey = `TIP_${log.process || "unknown"}_${
        log.step || "unknown"
      }_${log.ppid || "unknown"}`;
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          id: groupKey,
          content: makeTipGroupLabel(
            log.process,
            log.step,
            log.ppid,
            showLegend
          ),
          className: showLegend
            ? "custom-group-label tip-group legend-mode"
            : "custom-group-label tip-group",
          order: 100 + groupMap.size,
          title: `Process: ${log.process || "N/A"} | Step: ${
            log.step || "N/A"
          } | PPID: ${log.ppid || "N/A"}`,
        });
      }
    });

    return Array.from(groupMap.values()).sort((a, b) => a.order - b.order);
  }, [filteredTipLogs, showLegend]);

  // 전체 그룹 정의
  const groups = useMemo(() => {
    const baseGroups = [
      {
        id: "EQP",
        content: makeGroupLabel("EQP", "EQP 로그", showLegend),
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
        order: 1,
      },
    ];

    return [...baseGroups, ...tipGroups];
  }, [showLegend, tipGroups]);

  // 아이템 목록 생성
  const items = useMemo(() => {
    const eqpItems = processData("EQP", dataMap.EQP || []);

    // 필터링된 TIP 아이템을 각 그룹에 할당
    const tipItems = [];
    filteredTipLogs.forEach((log) => {
      const groupKey = `TIP_${log.process || "unknown"}_${
        log.step || "unknown"
      }_${log.ppid || "unknown"}`;
      const item = processData("TIP", [log])[0];
      if (item) {
        tipItems.push({
          ...item,
          group: groupKey,
        });
      }
    });

    return [...eqpItems, ...tipItems];
  }, [dataMap.EQP, filteredTipLogs]);

  // vis-timeline 옵션 설정
  const options = useMemo(
    () => ({
      stack: false,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 1000,
      margin: { item: 0, axis: 0 },
      groupOrder: "order",
      selectable: true,
      verticalScroll: true,
      maxHeight: 400,
      tooltip: {
        followMouse: true,
        overflowMethod: "cap",
      },
    }),
    [range]
  );

  useVisTimeline({ containerRef, groups, items, options });

  return (
    <div className="timeline-container relative">
      {/* 타임라인 헤더 */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          ⛓ EQP + TIP 로그
        </h3>
        {selectedTipGroups &&
          selectedTipGroups.length > 0 &&
          selectedTipGroups[0] !== "__ALL__" && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {tipGroups.length}개의 TIP 그룹 표시 중
            </span>
          )}
      </div>

      {/* 타임라인 */}
      <div
        ref={containerRef}
        className="timeline"
        style={{ minHeight: "200px" }}
      />
    </div>
  );
}
