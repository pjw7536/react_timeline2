import React, { useEffect, useRef } from "react";
import { useSelectionStore } from "@/shared/store";

/**
 * 날짜 형식 변환 함수
 * 예: "2025. 6. 2. 10시 0분 0초" → "25/06/02 10:00"
 */
function formatDateString(dateString) {
  const match = dateString.match(
    /(\d{4})\. (\d{1,2})\. (\d{1,2})\. (\d{1,2})시 (\d{1,2})분/
  );
  if (!match) return dateString;

  const [, year, month, day, hour, minute] = match;
  return `${year.slice(2)}/${month.padStart(2, "0")}/${day.padStart(
    2,
    "0"
  )} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

/**
 * 통합 데이터 테이블 컴포넌트
 * @param {Object[]} data - 필터링된 로그 배열
 * @param {Object} typeFilters - 로그 타입 필터링 상태
 * @param {Function} handleFilter - 체크박스 변경 핸들러
 */
export default function CombinedDataTable({ data, typeFilters, handleFilter }) {
  const { selectedRow, source, setSelectedRow } = useSelectionStore();
  const rowRefs = useRef({});

  useEffect(() => {
    if (source === "timeline" && selectedRow && rowRefs.current[selectedRow]) {
      rowRefs.current[selectedRow].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedRow, source]);

  const cols = [
    { header: "Time", accessor: "displayTimestamp" },
    { header: "LogType", accessor: "logType" },
    { header: "ChangeType", accessor: "info1" },
    { header: "Operator", accessor: "info2" },
    { header: "Duration", accessor: "duration" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 상단 필터 영역 */}
      <div className="flex justify-between items-center pt-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-t-lg">
        <h3 className="text-md font-semibold mb-3">📜 Data Log</h3>
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
      </div>

      {/* 테이블 영역 */}
      {data.length === 0 ? (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 p-2">
          표시할 데이터가 없습니다.
        </div>
      ) : (
        <div className="flex-1 overflow-auto table-scroll">
          <table className="w-full text-sm text-center text-gray-800 dark:text-gray-200">
            <thead className="sticky top-0 bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100">
              <tr>
                {cols.map((c) => (
                  <th key={c.accessor} className="px-3 py-2 font-semibold">
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const isSel = String(row.id) === String(selectedRow);
                return (
                  <tr
                    key={row.id}
                    ref={(el) => (rowRefs.current[row.id] = el)}
                    onClick={() =>
                      setSelectedRow(isSel ? null : row.id, "table")
                    }
                    className={`transition-colors duration-300 cursor-pointer ${
                      isSel
                        ? "bg-yellow-100 dark:bg-yellow-800"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    {cols.map((c) => (
                      <td key={c.accessor} className="px-3 py-2">
                        {c.accessor === "displayTimestamp"
                          ? formatDateString(row[c.accessor])
                          : row[c.accessor] ?? "-"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
