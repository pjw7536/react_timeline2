import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useSelectionStore } from "@shared/store";
import { useTimelineStore } from "@features/timeline/store/timelineStore";
import { useUrlValidation } from "@features/timeline/hooks/useUrlValidation";
import { useUrlSync } from "@features/timeline/hooks/useUrlSync";
import { transformLogsToTableData } from "@features/timeline/utils/dataTransformers";
import { DEFAULT_TYPE_FILTERS } from "@features/timeline/constants";
import LogViewerSection from "@features/timeline/components/LogViewerSection";
import DataLogSection from "@features/timeline/components/DataLogSection";
import ShareButton from "@features/timeline/components/ShareButton";
import { TimelineBoard } from "@features/timeline";
import { LogDetailSection } from "@features/logdetail";
import { LoadingSpinner } from "@shared/components";
import TimelineSettings from "@features/timeline/components/TimelineSettings";
// 모든 개별 hooks import
import { useEqpLogs } from "@features/timeline/hooks/useEqpLogs";
import { useTipLogs } from "@features/timeline/hooks/useTipLogs";
import { useCtttmLogs } from "@features/timeline/hooks/useCtttmLogs";
import { useRacbLogs } from "@features/timeline/hooks/useRacbLogs";
import { useJiraLogs } from "@features/timeline/hooks/useJiraLogs";

export default function TimelinePage() {
  const params = useParams();

  // Selection Store (드릴다운 상태와 선택 상태)
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

  // Timeline Store (timeline 전용 상태)
  const { showLegend, selectedTipGroups, setShowLegend, setSelectedTipGroups } =
    useTimelineStore();

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

  // 각 타임라인의 로그 데이터를 개별적으로 가져오기
  const enabled = Boolean(lineId && eqpId);
  const { data: eqpLogs = [], isLoading: eqpLoading } = useEqpLogs(
    lineId,
    eqpId
  );
  const { data: tipLogs = [], isLoading: tipLoading } = useTipLogs(
    lineId,
    eqpId
  );
  const { data: ctttmLogs = [], isLoading: ctttmLoading } = useCtttmLogs(
    lineId,
    eqpId
  );
  const { data: racbLogs = [], isLoading: racbLoading } = useRacbLogs(
    lineId,
    eqpId
  );
  const { data: jiraLogs = [], isLoading: jiraLoading } = useJiraLogs(
    lineId,
    eqpId
  );

  // 로딩 상태 계산
  const logsLoading =
    eqpLoading || tipLoading || ctttmLoading || racbLoading || jiraLoading;

  // 로컬 상태 (timeline과 관련 없는 상태들)
  const [typeFilters, setTypeFilters] = useState(DEFAULT_TYPE_FILTERS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 필터 핸들러
  const handleFilter = (e) =>
    setTypeFilters((prev) => ({ ...prev, [e.target.name]: e.target.checked }));

  // 로그 데이터에 duration 추가
  const logsWithDuration = useMemo(() => {
    const addDuration = (logs, logType) => {
      if (!logs || logs.length === 0) return logs;

      // 시간순 정렬 (오래된 것부터)
      const sortedLogs = [...logs].sort(
        (a, b) => new Date(a.eventTime) - new Date(b.eventTime)
      );

      return sortedLogs.map((log, index) => {
        let duration = null;

        // EQP와 TIP만 duration 계산
        if (logType === "EQP" || logType === "TIP") {
          if (index < sortedLogs.length - 1) {
            // 다음 로그까지의 시간
            const nextLog = sortedLogs[index + 1];
            const startTime = new Date(log.eventTime).getTime();
            const endTime = new Date(nextLog.eventTime).getTime();
            duration = endTime - startTime;
          } else {
            // 마지막 로그는 현재 시간까지
            const startTime = new Date(log.eventTime).getTime();
            const endTime = new Date().getTime();
            duration = endTime - startTime;
          }
        }

        return { ...log, duration };
      });
    };

    return {
      eqpLogs: addDuration(eqpLogs, "EQP"),
      tipLogs: addDuration(tipLogs, "TIP"),
      ctttmLogs: ctttmLogs, // duration 필요 없음
      racbLogs: racbLogs, // duration 필요 없음
      jiraLogs: jiraLogs, // duration 필요 없음
    };
  }, [eqpLogs, tipLogs, ctttmLogs, racbLogs, jiraLogs]);

  // typeFilters를 적용한 필터된 로그 데이터
  const filteredLogsForTimeline = useMemo(() => {
    return {
      eqpLogs: typeFilters.EQP ? logsWithDuration.eqpLogs : [],
      tipLogs: typeFilters.TIP ? logsWithDuration.tipLogs : [],
      ctttmLogs: typeFilters.CTTTM ? logsWithDuration.ctttmLogs : [],
      racbLogs: typeFilters.RACB ? logsWithDuration.racbLogs : [],
      jiraLogs: typeFilters.JIRA ? logsWithDuration.jiraLogs : [],
    };
  }, [logsWithDuration, typeFilters]);

  // 모든 로그 데이터를 하나로 합치기
  const mergedLogs = useMemo(() => {
    if (!enabled) return [];

    const allLogs = [
      ...logsWithDuration.eqpLogs,
      ...logsWithDuration.tipLogs,
      ...logsWithDuration.ctttmLogs,
      ...logsWithDuration.racbLogs,
      ...logsWithDuration.jiraLogs,
    ];

    // 시간순으로 정렬 (최신순)
    return allLogs.sort(
      (a, b) =>
        new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()
    );
  }, [logsWithDuration, enabled]);

  // 테이블 데이터 변환
  const tableData = useMemo(
    () =>
      enabled && !logsLoading
        ? transformLogsToTableData(mergedLogs, typeFilters)
        : [],
    [mergedLogs, logsLoading, enabled, typeFilters]
  );

  // 선택된 로그 (병합된 로그에서 찾기)
  const selectedLog = useMemo(
    () => mergedLogs.find((log) => String(log.id) === String(selectedRow)),
    [mergedLogs, selectedRow]
  );

  // TIP 로그만 필터링 (Settings Drawer용)
  const filteredTipLogs = useMemo(
    () => mergedLogs.filter((log) => log.logType === "TIP"),
    [mergedLogs]
  );

  // 검증 중일 때 로딩 표시
  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <LoadingSpinner />
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
    <div className="flex flex-row h-[calc(100vh-85px)] mt-3 gap-2">
      {/* 왼쪽 패널 */}
      <div className="flex flex-col h-full min-h-0 w-[35%] gap-2">
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

      {/* 오른쪽 패널 + 설정 패널 포함 */}
      <div className="flex flex-row h-full w-[65%]">
        {/* 타임라인 패널 */}
        <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-slate-800 shadow rounded-xl pl-4 pr-1 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between my-5">
            <div className="flex items-center gap-2">
              <h2 className="text-md font-bold text-slate-900 dark:text-white">
                📊 Timeline
              </h2>
              {lineId && eqpId && <ShareButton />}
            </div>

            {eqpId && !logsLoading && (
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="mr-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
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
            <TimelineBoard
              lineId={lineId}
              eqpId={eqpId}
              showLegend={showLegend}
              selectedTipGroups={selectedTipGroups}
              eqpLogs={logsWithDuration.eqpLogs}
              tipLogs={logsWithDuration.tipLogs}
              ctttmLogs={logsWithDuration.ctttmLogs}
              racbLogs={logsWithDuration.racbLogs}
              jiraLogs={logsWithDuration.jiraLogs}
              typeFilters={typeFilters}
            />
          )}
        </div>

        {/* 설정 패널 */}
        {eqpId && !logsLoading && (
          <TimelineSettings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            showLegend={showLegend}
            selectedTipGroups={selectedTipGroups}
            onLegendToggle={setShowLegend}
            onTipFilterChange={setSelectedTipGroups}
            tipLogs={filteredTipLogs}
          />
        )}
      </div>
    </div>
  );
}
