import React, { useState, useMemo } from "react";
import { useLogs } from "@/features/timeline";
import { LineSelector, SDWTSelector, EqpSelector } from "@/features/drilldown";
import { TimelineBoard } from "@/features/timeline";
import CombinedDataTable from "@/features/table/CombinedDataTable";
import LogDetailSection from "@/features/table/LogDetailSection";
import LoadingSpinner from "@/shared/LoadingSpinner";
import { formatDateTime } from "@/shared/dateUtils";
import { useSelectionStore } from "@/shared/store";

const DATA_TYPES = {
  EQP: "EQP",
  TIP: "TIP",
  RACB: "RACB",
  CTTTM: "CTTTM",
};

export default function TimelinePage() {
  const { lineId, sdwtId, eqpId, setLine, setSdwt, setEqp } =
    useSelectionStore();
  const enabled = Boolean(lineId && eqpId);
  const {
    data: logs = [],
    isLoading: logsLoading,
    isError: logsError,
  } = useLogs({ lineId, sdwtId, eqpId }, enabled);

  const [typeFilters, setTypeFilters] = useState({
    [DATA_TYPES.EQP]: true,
    [DATA_TYPES.TIP]: true,
    [DATA_TYPES.RACB]: true,
    [DATA_TYPES.CTTTM]: true,
  });
  const handleFilter = (e) =>
    setTypeFilters((p) => ({ ...p, [e.target.name]: e.target.checked }));

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
        timestamp: new Date(l.eventTime).getTime(),
        displayTimestamp: formatDateTime(l.eventTime),
        logType: l.logType,
        info1: l.eventType,
        info2: l.operator || "-",
        duration: l.duration?.toFixed(0) ?? "-",
      }))
      .filter((r) => typeFilters[r.logType])
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [logs, logsLoading, enabled, typeFilters]);

  const { selectedRow } = useSelectionStore();
  const selectedLog = useMemo(
    () => logs.find((l) => String(l.id) === String(selectedRow)),
    [logs, selectedRow]
  );

  const [showLegend, setShowLegend] = useState(false);

  if (logsError)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-red-500">로그 로딩 오류!</p>
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-110px)] gap-2 mt-3">
      {/* 왼쪽: 세 칸 구조! */}
      <div className="flex flex-col h-full min-h-0 lg:w-[40%] gap-2">
        {/* 1. Log Viewer */}
        <section className="bg-white dark:bg-slate-800 shadow rounded-xl p-3 flex flex-col">
          <h2 className="text-md font-bold text-slate-900 dark:text-white border-slate-200 dark:border-slate-700">
            📊 Log Viewer
          </h2>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <LineSelector lineId={lineId} setLineId={setLine} />
            <SDWTSelector lineId={lineId} sdwtId={sdwtId} setSdwtId={setSdwt} />
            <EqpSelector
              lineId={lineId}
              sdwtId={sdwtId}
              eqpId={eqpId}
              setEqpId={setEqp}
            />
          </div>
        </section>

        {/* 아래 영역 전체를 다시 flex-col로 감싸서 분할 */}
        <div className="flex-1 min-h-0 flex flex-col gap-2">
          {/* 2. Data Log - 비율 2 (예시) */}
          <section className="bg-white dark:bg-slate-800 shadow rounded-xl p-3 flex-[3] min-h-0 flex flex-col overflow-auto">
            {!eqpId && !logsLoading ? (
              <p className="text-center text-slate-600 dark:text-slate-400 py-10">
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
          </section>

          {/* 3. Log Detail - 비율 1 */}
          <section
            className="bg-white dark:bg-slate-800 shadow rounded-xl p-3 flex-[1] min-h-0 flex flex-col overflow-auto"
            style={{ minHeight: 180, maxHeight: 320 }}
          >
            <h2 className="text-md font-bold text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 pb-1">
              📝 Log Detail
            </h2>
            <hr className="my-1 border-slate-300 dark:border-slate-600" />
            <LogDetailSection log={selectedLog} />
          </section>
        </div>
      </div>

      {/* 오른쪽: 타임라인 */}
      <div className="lg:w-[60%] h-full overflow-hidden bg-white dark:bg-slate-800 shadow rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-md font-bold text-slate-900 dark:text-white">
            📊 Timeline
          </h2>

          <div className="flex justify-end">
            <label className="inline-flex items-center cursor-pointer">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 font-bold">
                Legend 보기
              </span>
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={showLegend}
                onChange={() => setShowLegend((v) => !v)}
              />
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        <hr className="my-4 border-slate-300 dark:border-slate-600" />
        {!eqpId && !logsLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-slate-600 dark:text-slate-400">
              EQP를 선택하세요.
            </p>
          </div>
        ) : logsLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <TimelineBoard dataMap={logsByType} showLegend={showLegend} />
        )}
      </div>
    </div>
  );
}
