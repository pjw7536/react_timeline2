// src/features/table/VirtualizedDataTable.jsx
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import { useSelectionStore } from "@/shared/store";
import { formatDateTime } from "@/shared/dateUtils";

/**
 * 가상화된 데이터 테이블 컴포넌트
 * react-window를 사용하여 대량의 데이터도 부드럽게 렌더링
 */
export default function VirtualizedDataTable({
  data,
  typeFilters,
  handleFilter,
}) {
  const { selectedRow, source, setSelectedRow } = useSelectionStore();
  const listRef = useRef(null);
  const rowHeights = useRef({});

  // 타임라인에서 선택된 항목이 있을 때 해당 행으로 스크롤
  useEffect(() => {
    if (source === "timeline" && selectedRow && listRef.current) {
      const index = data.findIndex(
        (row) => String(row.id) === String(selectedRow)
      );
      if (index >= 0) {
        listRef.current.scrollToItem(index, "center");
      }
    }
  }, [selectedRow, source, data]);

  // 헤더 컴포넌트
  const TableHeader = useMemo(
    () => (
      <div className="sticky top-0 z-10 bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100">
        <div className="flex text-xs font-semibold">
          <div className="w-32 px-3 py-2 text-center">Time</div>
          <div className="w-24 px-3 py-2 text-center">LogType</div>
          <div className="w-40 px-3 py-2 text-center">ChangeType</div>
          <div className="w-28 px-3 py-2 text-center">Operator</div>
          <div className="w-20 px-3 py-2 text-center">Duration</div>
          <div className="w-20 px-3 py-2 text-center">URL</div>
        </div>
      </div>
    ),
    []
  );

  // 필터 체크박스 컴포넌트
  const FilterCheckboxes = useMemo(
    () => (
      <div className="flex gap-3 flex-wrap mr-3">
        {Object.entries(typeFilters).map(([type, checked]) => (
          <label
            key={type}
            className="flex items-center gap-1 text-xs font-bold"
          >
            <input
              type="checkbox"
              name={type}
              checked={checked}
              onChange={handleFilter}
              className="rounded border-gray-300 dark:border-slate-600"
            />
            {type.replace("_LOG", "")}
          </label>
        ))}
      </div>
    ),
    [typeFilters, handleFilter]
  );

  // 행 렌더링 함수
  const Row = useCallback(
    ({ index, style }) => {
      const row = data[index];
      const isSel = String(row.id) === String(selectedRow);

      const handleClick = () => {
        setSelectedRow(isSel ? null : row.id, "table");
      };

      const handleUrlClick = (e) => {
        e.stopPropagation(); // 행 클릭 이벤트 방지
        if (row.url) {
          window.open(row.url, "_blank", "noopener,noreferrer");
        }
      };

      return (
        <div
          style={style}
          onClick={handleClick}
          className={`flex items-center transition-colors duration-300 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
            isSel
              ? "bg-yellow-100 dark:bg-yellow-800"
              : "bg-white dark:bg-gray-800"
          }`}
        >
          <div className="w-32 px-3 py-2 text-xs text-center text-gray-800 dark:text-gray-200">
            {row.displayTimestamp}
          </div>
          <div className="w-24 px-3 py-2 text-xs text-center text-gray-800 dark:text-gray-200">
            <span
              className={`
            inline-block px-2 py-1 text-xs font-medium rounded
            ${
              row.logType === "EQP"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : ""
            }
            ${
              row.logType === "TIP"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : ""
            }
            ${
              row.logType === "RACB"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : ""
            }
            ${
              row.logType === "CTTTM"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                : ""
            }
            ${
              row.logType === "JIRA"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : ""
            }
          `}
            >
              {row.logType}
            </span>
          </div>
          <div className="w-40 px-3 py-2 text-xs text-center text-gray-800 dark:text-gray-200">
            {row.info1}
          </div>
          <div className="w-28 px-3 py-2 text-xs text-center text-gray-800 dark:text-gray-200">
            {row.info2}
          </div>
          <div className="w-20 px-3 py-2 text-xs text-center text-gray-800 dark:text-gray-200">
            {row.duration}
          </div>
          <div className="w-20 px-3 py-2 text-xs text-center">
            {row.url ? (
              <button
                onClick={handleUrlClick}
                className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                title="Open URL"
              >
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            ) : (
              <span className="text-gray-400 dark:text-gray-600">-</span>
            )}
          </div>
        </div>
      );
    },
    [data, selectedRow, setSelectedRow]
  );

  // 리스트 컨테이너의 높이 계산
  const [containerHeight, setContainerHeight] = React.useState(400);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = rect.height - 120; // 헤더와 필터 영역 제외
        setContainerHeight(Math.max(200, availableHeight));
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden" ref={containerRef}>
      {/* 상단 필터 영역 */}
      <div className="flex justify-between items-center pt-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-t-lg">
        <h3 className="text-md font-semibold mb-5">📜 Data Log</h3>
        {FilterCheckboxes}
      </div>

      {/* 테이블 영역 */}
      <div className="flex-1 overflow-hidden">
        {data.length === 0 ? (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 p-4">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          <div className="h-full bg-white dark:bg-gray-800 rounded-b-lg overflow-hidden">
            {TableHeader}
            <List
              ref={listRef}
              height={containerHeight}
              itemCount={data.length}
              itemSize={36} // 각 행의 높이
              width="100%"
              className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
            >
              {Row}
            </List>
          </div>
        )}
      </div>
    </div>
  );
}
