// src/features/table/components/VirtualizedDataTable.jsx
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import { useSelectionStore } from "@shared/store";
import { LinkIcon } from "@heroicons/react/24/outline";

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
  const scrollAnimationRef = useRef(null);
  const containerRef = useRef(null);
  const isFilterChangingRef = useRef(false);
  const prevTypeFiltersRef = useRef(typeFilters);

  // 오버스캔 카운트 증가로 더 많은 행을 미리 렌더링
  const OVERSCAN_COUNT = 10;
  const ITEM_HEIGHT = 36;

  // 필터 변경 감지
  useEffect(() => {
    // 필터가 변경되었는지 확인
    const filtersChanged =
      JSON.stringify(prevTypeFiltersRef.current) !==
      JSON.stringify(typeFilters);

    if (filtersChanged) {
      isFilterChangingRef.current = true;
      prevTypeFiltersRef.current = typeFilters;

      // 필터 변경 후 잠시 뒤에 플래그를 리셋
      setTimeout(() => {
        isFilterChangingRef.current = false;
      }, 300);
    }
  }, [typeFilters]);

  // 부드러운 스크롤 함수
  const smoothScrollTo = useCallback((targetOffset, duration = 200) => {
    if (!listRef.current) return;

    const startOffset = listRef.current.state.scrollOffset;
    const distance = targetOffset - startOffset;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      // 컴포넌트가 언마운트되었는지 확인
      if (!listRef.current) {
        if (scrollAnimationRef.current) {
          cancelAnimationFrame(scrollAnimationRef.current);
        }
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeInOutQuad 이징 함수
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentOffset = startOffset + distance * easeProgress;

      // react-window의 scrollTo 메서드 사용
      listRef.current.scrollTo(currentOffset);

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animateScroll);
      }
    };

    // 이전 애니메이션 취소
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    requestAnimationFrame(animateScroll);
  }, []);

  // 타임라인에서 선택된 항목이 있을 때 해당 행으로 스크롤
  useEffect(() => {
    // 필터가 변경 중이면 스크롤하지 않음
    if (isFilterChangingRef.current) {
      return;
    }

    if (
      source === "timeline" &&
      selectedRow &&
      listRef.current &&
      data.length > 0
    ) {
      const index = data.findIndex(
        (row) => String(row.id) === String(selectedRow)
      );

      if (index >= 0) {
        // 목표 위치 계산 (화면 중앙에 오도록)
        const listHeight = listRef.current?.props.height || containerHeight;
        const targetOffset =
          index * ITEM_HEIGHT - listHeight / 2 + ITEM_HEIGHT / 2;
        const maxOffset = data.length * ITEM_HEIGHT - listHeight;
        const finalOffset = Math.max(0, Math.min(targetOffset, maxOffset));

        // 부드러운 스크롤 실행
        smoothScrollTo(finalOffset);
      }
    }
  }, [selectedRow, source, data, smoothScrollTo]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  // 컬럼 너비 정의 (px 단위로 통일)
  const columnWidths = useMemo(
    () => ({
      time: 112,
      logType: 80,
      changeType: 160,
      operator: 70,
      duration: 70,
      url: 70,
    }),
    []
  );

  // 헤더 컴포넌트
  const TableHeader = useMemo(
    () => (
      <div className="sticky top-0 z-10 bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100">
        <div className="flex text-xs font-semibold">
          <div
            style={{ width: `${columnWidths.time}px` }}
            className="px-2 py-2 text-center flex-shrink-0"
          >
            Time
          </div>
          <div
            style={{ width: `${columnWidths.logType}px` }}
            className="px-2 py-2 text-center flex-shrink-0"
          >
            LogType
          </div>
          <div
            style={{ width: `${columnWidths.changeType}px` }}
            className="px-2 py-2 text-center flex-shrink-0"
          >
            ChangeType
          </div>
          <div
            style={{ width: `${columnWidths.operator}px` }}
            className="px-2 py-2 text-center flex-shrink-0"
          >
            Operator
          </div>
          <div
            style={{ width: `${columnWidths.duration}px` }}
            className="px-2 py-2 text-center flex-shrink-0"
          >
            Duration
          </div>
          <div
            style={{ width: `${columnWidths.url}px` }}
            className="px-2 py-2 text-center flex-shrink-0"
          >
            URL
          </div>
        </div>
      </div>
    ),
    [columnWidths]
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

  // itemData 메모이제이션
  const itemData = useMemo(
    () => ({
      data,
      selectedRow,
      setSelectedRow,
      columnWidths,
    }),
    [data, selectedRow, setSelectedRow, columnWidths]
  );

  // 행 렌더링 함수 - React.memo로 최적화
  const Row = React.memo(({ index, style, data: itemData }) => {
    const { data, selectedRow, setSelectedRow, columnWidths } = itemData;
    const row = data[index];
    const isSel = String(row.id) === String(selectedRow);

    // 클래스명 메모이제이션
    const rowClassName = useMemo(() => {
      const base =
        "flex items-center cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700";
      return isSel
        ? `${base} bg-yellow-200 dark:bg-yellow-800 dark:ring-yellow-700 transition-all duration-200`
        : `${base} bg-white dark:bg-gray-800 transition-colors duration-150`;
    }, [isSel]);

    const handleClick = useCallback(() => {
      setSelectedRow(isSel ? null : row.id, "table");
    }, [isSel, row.id, setSelectedRow]);

    const handleUrlClick = useCallback(
      (e) => {
        e.stopPropagation();
        if (row.url) {
          window.open(row.url, "_blank", "noopener,noreferrer");
        }
      },
      [row.url]
    );

    return (
      <div
        style={{
          ...style,
          willChange: "transform",
        }}
        onClick={handleClick}
        className={rowClassName}
      >
        <div
          style={{ width: `${columnWidths.time}px` }}
          className="px-2 py-2 text-xs text-center text-gray-800 dark:text-gray-200 flex-shrink-0"
        >
          {row.displayTimestamp}
        </div>
        <div
          style={{ width: `${columnWidths.logType}px` }}
          className="px-2 py-2 text-xs text-center text-gray-800 dark:text-gray-200 flex-shrink-0"
        >
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
        <div
          style={{ width: `${columnWidths.changeType}px` }}
          className="px-2 py-2 text-xs text-center text-gray-800 dark:text-gray-200 flex-shrink-0"
        >
          {row.info1}
        </div>
        <div
          style={{ width: `${columnWidths.operator}px` }}
          className="px-2 py-2 text-xs text-center text-gray-800 dark:text-gray-200 flex-shrink-0"
        >
          {row.info2}
        </div>
        <div
          style={{ width: `${columnWidths.duration}px` }}
          className="px-2 py-2 text-xs text-center text-gray-800 dark:text-gray-200 flex-shrink-0"
        >
          {row.duration}
        </div>
        <div
          style={{ width: `${columnWidths.url}px` }}
          className="px-2 py-2 text-xs text-center flex-shrink-0"
        >
          {row.url ? (
            <button
              onClick={handleUrlClick}
              className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              title="Open URL"
            >
              <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          ) : (
            <span className="text-gray-400 dark:text-gray-600">-</span>
          )}
        </div>
      </div>
    );
  });

  Row.displayName = "Row";

  // 리스트 컨테이너의 높이 계산
  const [containerHeight, setContainerHeight] = React.useState(400);

  // ResizeObserver를 사용한 높이 계산 최적화
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableHeight = entry.contentRect.height - 120;
        setContainerHeight(Math.max(200, availableHeight));
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
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
              itemSize={ITEM_HEIGHT}
              itemData={itemData}
              width="100%"
              overscanCount={OVERSCAN_COUNT}
              style={{
                contain: "strict",
                overflowAnchor: "none",
              }}
            >
              {Row}
            </List>
          </div>
        )}
      </div>
    </div>
  );
}
