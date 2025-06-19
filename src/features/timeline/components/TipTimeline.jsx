// src/features/timeline/components/TipTimeline.jsx
import React, { useMemo } from "react";
import BaseTimeline from "./BaseTimeline";
import { processData } from "../utils/timelineUtils";
import { makeTipGroupLabel } from "../utils/groupLabel";

export default function TipTimeline({
  tipLogs = [],
  range,
  showLegend,
  selectedTipGroups = ["__ALL__"],
  showTimeAxis = true,
}) {
  const filteredTipLogs = useMemo(() => {
    if (!tipLogs.length) return [];
    if (selectedTipGroups.includes("__ALL__")) return tipLogs;

    return tipLogs.filter((log) => {
      const groupKey = `${log.process || "unknown"}_${log.step || "unknown"}_${
        log.ppid || "unknown"
      }`;
      return selectedTipGroups.includes(groupKey);
    });
  }, [tipLogs, selectedTipGroups]);

  const { groups, items } = useMemo(() => {
    const groupMap = new Map();
    const processedItems = [];

    filteredTipLogs.forEach((log) => {
      const groupKey = `TIP_${log.process || "unknown"}_${
        log.step || "unknown"
      }_${log.ppid || "unknown"}`;

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          id: groupKey,
          content: makeTipGroupLabel(log.process, log.step, log.ppid),
          className: "custom-group-label tip-group",
          order: 100 + groupMap.size,
          title: `Process: ${log.process || "N/A"} | Step: ${
            log.step || "N/A"
          } | PPID: ${log.ppid || "N/A"}`,
        });
      }
    });

    const groupedLogs = new Map();
    filteredTipLogs.forEach((log) => {
      const groupKey = `TIP_${log.process || "unknown"}_${
        log.step || "unknown"
      }_${log.ppid || "unknown"}`;

      if (!groupedLogs.has(groupKey)) {
        groupedLogs.set(groupKey, []);
      }
      groupedLogs.get(groupKey).push(log);
    });

    groupedLogs.forEach((logs, groupKey) => {
      const items = processData("TIP", logs, true);
      items.forEach((item) => {
        processedItems.push({ ...item, group: groupKey });
      });
    });

    return {
      groups: Array.from(groupMap.values()).sort((a, b) => a.order - b.order),
      items: processedItems,
    };
  }, [filteredTipLogs]);

  const options = useMemo(() => {
    const calculatedHeight = groups.length * 35;

    return {
      stack: false,
      min: range.min,
      max: range.max,
      zoomMin: 60 * 60 * 1000,
      height: calculatedHeight,
      minHeight: calculatedHeight,
      maxHeight: calculatedHeight,
      verticalScroll: false,
      horizontalScroll: false,
      groupHeightMode: "fixed",
    };
  }, [range, groups.length]);

  // TIP 범례 항목
  const legendItems = [
    { state: "OPEN", color: "bg-blue-600", label: "OPEN" },
    { state: "CLOSE", color: "bg-red-600", label: "CLOSE" },
  ];

  if (tipLogs.length === 0 || groups.length === 0) {
    return (
      <div className="timeline-container relative">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            🔧 TIP 로그
          </h3>
          <span className="text-xs text-slate-500">
            {tipLogs.length === 0 ? "로그 없음" : "선택된 그룹 없음"}
          </span>
        </div>
        <div className="h-20 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tipLogs.length === 0
              ? "TIP 로그가 없습니다"
              : "표시할 TIP 그룹을 선택하세요"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <BaseTimeline
      groups={groups}
      items={items}
      options={options}
      title="🔧 TIP 로그"
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
