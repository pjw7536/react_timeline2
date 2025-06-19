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
      <div className="border-y border-gray-200 dark:border-gray-700 py-3">
        <div className="flex items-center justify-end">
          <LegendToggle showLegend={showLegend} onToggle={onLegendToggle} />
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
