import React, { useState, useMemo } from "react";
import { useLogs } from "@/features/timeline";
import { LineSelector, SDWTSelector, EqpSelector } from "@/features/drilldown";
import { TimelineBoard } from "@/features/timeline";
import CombinedDataTable from "@/features/table/CombinedDataTable";
import LoadingSpinner from "@/shared/LoadingSpinner";
import { useSelectionStore } from "@/shared/store";

const DATA_TYPES = {
  EQP: "EQP",
  TIP: "TIP",
  RACB: "RACB",
  CTTTM: "CTTTM",
};

export default function TimelinePage() {
  /* ───────────────── 드릴다운 상태 (Zustand) ───────────────── */
  const { lineId, sdwtId, eqpId, setLine, setSdwt, setEqp } =
    useSelectionStore();

  /* ───────────────── 로그 Fetch ───────────────── */
  const enabled = Boolean(lineId && eqpId);
  const {
    data: logs = [],
    isLoading: logsLoading,
    isError: logsError,
  } = useLogs({ lineId, sdwtId, eqpId }, enabled);

  /* ───────────────── 체크박스 필터 ───────────────── */
  const [typeFilters, setTypeFilters] = useState({
    [DATA_TYPES.EQP]: true,
    [DATA_TYPES.TIP]: true,
    [DATA_TYPES.RACB]: true,
    [DATA_TYPES.CTTTM]: true,
  });
  const handleFilter = (e) =>
    setTypeFilters((p) => ({ ...p, [e.target.name]: e.target.checked }));

  /* ───────────────── 로그 분류 & 테이블 가공 ───────────────── */
  const logsByType = useMemo(() => {
    const g = { EQP: [], TIP: [], RACB: [], CTTTM: [] };
    logs.forEach((l) => g[l.logType]?.push(l));
    return g;
  }, [logs]);

  const tableData = useMemo(() => {
    if (!enabled || logsLoading) return [];
    return logs
      .map((l) => ({
        id: l.id,
        displayTimestamp: new Date(l.eventTime).toLocaleString("ko-KR", {
          hour12: false,
        }),
        logType: l.logType,
        info1: l.eventType,
        info2: l.operator || "-",
        duration: l.duration?.toFixed(0) ?? "-",
      }))
      .filter((r) => typeFilters[r.logType])
      .sort(
        (a, b) => new Date(b.displayTimestamp) - new Date(a.displayTimestamp)
      );
  }, [logs, logsLoading, enabled, typeFilters]);

  /* ───────────────── UI ───────────────── */
  if (logsError)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-red-500">로그 로딩 오류!</p>
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-110px)] gap-3 mt-4">
      {/* 왼쪽: 선택기 + 테이블 */}
      <div className="lg:w-[40%] flex flex-col gap-4 h-full">
        <div className="p-4 bg-white dark:bg-slate-800 shadow rounded-xl">
          <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">
            📊 EQP 타임라인 뷰어
          </h2>

          {/* 드릴다운 */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <LineSelector lineId={lineId} setLineId={setLine} />
            <SDWTSelector lineId={lineId} sdwtId={sdwtId} setSdwtId={setSdwt} />
            <EqpSelector
              lineId={lineId}
              sdwtId={sdwtId}
              eqpId={eqpId}
              setEqpId={setEqp}
            />
          </div>
        </div>

        {/* 테이블 */}
        <div className="flex-1 overflow-auto bg-white dark:bg-slate-800 shadow rounded-xl p-3">
          {!eqpId && !logsLoading ? (
            <p className="text-center text-slate-600 dark:text-slate-400">
              EQP를 선택하세요.
            </p>
          ) : logsLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <CombinedDataTable
              data={tableData}
              typeFilters={typeFilters}
              handleFilter={handleFilter}
            />
          )}
        </div>
      </div>

      {/* 오른쪽: 타임라인 */}
      <div className="lg:w-[60%] h-full overflow-auto bg-white dark:bg-slate-800 shadow rounded-xl p-4">
        {!eqpId && !logsLoading ? (
          <p className="text-center text-slate-600 dark:text-slate-400 py-20">
            EQP 선택 후 타임라인을 확인하세요.
          </p>
        ) : logsLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <TimelineBoard dataMap={logsByType} />
        )}
      </div>
    </div>
  );
}
