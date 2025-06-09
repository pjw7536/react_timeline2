import React from "react";
import LegendToggle from "./LegendToggle";
import TipFilterChips from "./TipFilterChips";

export default function TimelineSettings({
  showLegend,
  onLegendToggle,
  tipLogs,
  selectedTipGroups, // 추가
  onTipFilterChange,
}) {
  return (
    <div className="space-y-6">
      {/* Legend 설정 섹션 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          표시 설정
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-700 dark:text-gray-300">
              타임라인 범례 표시
            </span>
            <LegendToggle showLegend={showLegend} onToggle={onLegendToggle} />
          </div>
        </div>
      </div>

      {/* TIP 필터 섹션 */}
      {tipLogs && tipLogs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            TIP 그룹 필터
          </h3>
          <TipFilterChips
            tipLogs={tipLogs}
            selectedTipGroups={selectedTipGroups} // 추가
            onFilterChange={onTipFilterChange}
            inDrawer={true}
          />
        </div>
      )}
    </div>
  );
}
