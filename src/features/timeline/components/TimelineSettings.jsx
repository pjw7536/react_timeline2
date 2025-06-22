// src/features/timeline/components/TimelineSettings.jsx
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LegendToggle from "./LegendToggle";
import TipTreeFilter from "./TipTreeFilter";

export default function TimelineSettings({
  isOpen,
  onClose,
  showLegend,
  selectedTipGroups,
  onLegendToggle,
  onTipFilterChange,
  tipLogs,
}) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white dark:bg-slate-800 shadow-xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            타임라인 설정
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

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
              <TipTreeFilter
                tipLogs={tipLogs}
                selectedTipGroups={selectedTipGroups}
                onFilterChange={onTipFilterChange}
                inDrawer={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
