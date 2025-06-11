import React, { useMemo, useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function TipFilterChips({
  tipLogs,
  onFilterChange,
  inDrawer = false,
}) {
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(true); // 초기값은 전체 선택

  // TIP 로그를 그룹별로 정리
  const tipGroups = useMemo(() => {
    const groupMap = new Map();

    tipLogs.forEach((log) => {
      const groupKey = `${log.process || "unknown"}_${log.step || "unknown"}_${
        log.ppid || "unknown"
      }`;
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          key: groupKey,
          process: log.process || "unknown",
          step: log.step || "unknown",
          ppid: log.ppid || "unknown",
          count: 0,
        });
      }
      groupMap.get(groupKey).count++;
    });

    return Array.from(groupMap.values()).sort((a, b) => {
      if (a.process !== b.process) return a.process.localeCompare(b.process);
      if (a.step !== b.step) return a.step.localeCompare(b.step);
      return a.ppid.localeCompare(b.ppid);
    });
  }, [tipLogs]);

  // 표시할 그룹 (처음 5개 또는 전체)
  const displayGroups = showAll ? tipGroups : tipGroups.slice(0, 5);

  // 선택 상태가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (isAllSelected) {
      // 전체 선택 상태면 특별한 값 전달
      onFilterChange(["__ALL__"]);
    } else if (selectedGroups.size === 0) {
      // 아무것도 선택되지 않으면 빈 배열
      onFilterChange([]);
    } else {
      // 선택된 그룹들만 전달
      onFilterChange(Array.from(selectedGroups));
    }
  }, [selectedGroups, isAllSelected, onFilterChange]);

  // 그룹 선택/해제 핸들러
  const handleGroupToggle = (groupKey) => {
    if (isAllSelected) {
      // 전체 선택 상태에서 하나를 클릭하면, 나머지를 모두 선택하고 클릭한 것만 해제
      const newSelected = new Set(tipGroups.map((g) => g.key));
      newSelected.delete(groupKey);
      setSelectedGroups(newSelected);
      setIsAllSelected(false);
    } else {
      const newSelected = new Set(selectedGroups);
      if (newSelected.has(groupKey)) {
        newSelected.delete(groupKey);
      } else {
        newSelected.add(groupKey);
      }

      // 모든 그룹이 선택되면 전체 선택 상태로 변경
      if (newSelected.size === tipGroups.length) {
        setIsAllSelected(true);
        setSelectedGroups(new Set());
      } else {
        setSelectedGroups(newSelected);
      }
    }
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (isAllSelected || selectedGroups.size === tipGroups.length) {
      // 전체 해제
      setSelectedGroups(new Set());
      setIsAllSelected(false);
    } else {
      // 전체 선택
      setSelectedGroups(new Set());
      setIsAllSelected(true);
    }
  };

  // 그룹이 선택되었는지 확인
  const isGroupSelected = (groupKey) => {
    if (isAllSelected) return true;
    return selectedGroups.has(groupKey);
  };

  return (
    <div
      className={
        inDrawer ? "" : "bg-white dark:bg-slate-800 rounded-lg p-3 mb-2"
      }
    >
      <div className="flex items-center justify-between mb-2">
        {!inDrawer && (
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
            TIP 그룹 필터
          </h4>
        )}
        <div
          className={`flex items-center gap-2 ${
            inDrawer ? "w-full justify-end" : ""
          }`}
        >
          <button
            onClick={handleSelectAll}
            className="text-xs text-blue-700 dark:text-blue-300 hover:underline dark:hover:text-blue-300"
          >
            {isAllSelected || selectedGroups.size === tipGroups.length
              ? "전체 해제"
              : "전체 선택"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {displayGroups.map((group) => {
          const isSelected = isGroupSelected(group.key);
          return (
            <button
              key={group.key}
              onClick={() => handleGroupToggle(group.key)}
              className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                transition-all duration-200 border
                ${
                  isSelected
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 opacity-60"
                }
                hover:opacity-100
              `}
              title={`Process: ${group.process} | Step: ${group.step} | PPID: ${group.ppid}`}
            >
              <span className="font-semibold">{group.ppid}</span>
              <span className="text-[10px] text-gray-600 dark:text-gray-400">
                ({group.count})
              </span>
              {isSelected && <XMarkIcon className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}

        {!showAll && tipGroups.length > 5 && (
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300
              hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            +{tipGroups.length - 5} 더보기
          </button>
        )}
      </div>

      {!isAllSelected && selectedGroups.size === 0 && (
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          PPID 선택하세요
        </div>
      )}
    </div>
  );
}
