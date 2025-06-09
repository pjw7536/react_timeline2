// src/pages/TimelinePage.jsx
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useLogs } from "@/features/timeline";
import { useSelectionStore } from "@/shared/store";
import { useUrlValidation } from "@/features/timeline/hooks/useUrlValidation";
import { useUrlSync } from "@/features/timeline/hooks/useUrlSync";
import {
  groupLogsByType,
  transformLogsToTableData,
} from "@/features/timeline/utils/dataTransformers";
import { DEFAULT_TYPE_FILTERS } from "@/features/timeline/constants";
import LogViewerSection from "@/features/timeline/components/LogViewerSection";
import DataLogSection from "@/features/timeline/components/DataLogSection";
import ShareButton from "@/features/timeline/components/ShareButton";
import LegendToggle from "@/features/timeline/components/LegendToggle";
import { TimelineBoard } from "@/features/timeline";
import LogDetailSection from "@/features/table/LogDetailSection";
import LoadingSpinner from "@/shared/LoadingSpinner";
import Drawer from "@/shared/Drawer";
import TimelineSettings from "@/features/timeline/components/TimelineSettings";

export default function TimelinePage() {
  const params = useParams();
  const {
    lineId,
    sdwtId,
    prcGroup,
    eqpId,
    setLine,
    setSdwt,
    setPrcGroup,
    setEqp,
    selectedRow,
  } = useSelectionStore();

  // URL 검증
  const { isValidating, validationError, isUrlInitialized } = useUrlValidation(
    params,
    lineId,
    eqpId,
    setLine,
    setSdwt,
    setPrcGroup,
    setEqp
  );

  // URL 동기화
  useUrlSync(lineId, eqpId, isValidating, isUrlInitialized);

  // 로그 데이터 가져오기
  const enabled = Boolean(lineId && eqpId);
  const {
    data: logs = [],
    isLoading: logsLoading,
    isError: logsError,
  } = useLogs({ lineId, eqpId }, enabled);

  // 로컬 상태
  const [typeFilters, setTypeFilters] = useState(DEFAULT_TYPE_FILTERS);
  const [showLegend, setShowLegend] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTipGroups, setSelectedTipGroups] = useState(["__ALL__"]);

  // 필터 핸들러
  const handleFilter = (e) =>
    setTypeFilters((prev) => ({ ...prev, [e.target.name]: e.target.checked }));

  // 데이터 변환
  const logsByType = useMemo(() => groupLogsByType(logs), [logs]);
  const tableData = useMemo(
    () =>
      enabled && !logsLoading
        ? transformLogsToTableData(logs, typeFilters)
        : [],
    [logs, logsLoading, enabled, typeFilters]
  );

  // 선택된 로그
  const selectedLog = useMemo(
    () => logs.find((log) => String(log.id) === String(selectedRow)),
    [logs, selectedRow]
  );

  // 검증 중일 때 로딩 표시
  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 처리
  if (logsError) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-red-500">로그 로딩 오류!</p>
      </div>
    );
  }

  // 검증 에러 표시
  if (validationError) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <p className="text-red-500 mb-2">{validationError}</p>
          <p className="text-gray-500">잠시 후 메인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-85px)] gap-2 mt-3">
      {/* 왼쪽 패널 */}
      <div className="flex flex-col h-full min-h-0 lg:w-[35%] gap-2">
        <LogViewerSection
          lineId={lineId}
          sdwtId={sdwtId}
          prcGroup={prcGroup}
          eqpId={eqpId}
          setLine={setLine}
          setSdwt={setSdwt}
          setPrcGroup={setPrcGroup}
          setEqp={setEqp}
        />

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <DataLogSection
            eqpId={eqpId}
            logsLoading={logsLoading}
            tableData={tableData}
            typeFilters={typeFilters}
            handleFilter={handleFilter}
          />

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

      {/* 오른쪽 타임라인 패널 */}
      <div className="lg:w-[65%] h-full overflow-hidden bg-white dark:bg-slate-800 shadow rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-md font-bold text-slate-900 dark:text-white">
              📊 Timeline
            </h2>
            {lineId && eqpId && <ShareButton />}
          </div>

          {/* 설정 버튼 - EQP가 선택되었을 때만 표시 */}
          {eqpId && !logsLoading && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              설정
            </button>
          )}
        </div>

        <hr className="border-slate-300 dark:border-slate-600" />

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
          <div className="mt-4">
            <TimelineBoard
              dataMap={logsByType}
              showLegend={showLegend}
              selectedTipGroups={selectedTipGroups}
            />
          </div>
        )}
      </div>

      {/* Settings Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="타임라인 설정"
      >
        <TimelineSettings
          showLegend={showLegend}
          onLegendToggle={() => setShowLegend((v) => !v)}
          tipLogs={logsByType.TIP}
          selectedTipGroups={selectedTipGroups}
          onTipFilterChange={setSelectedTipGroups}
        />
      </Drawer>
    </div>
  );
}
