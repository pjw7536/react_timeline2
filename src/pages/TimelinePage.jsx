import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLogs } from "@/features/timeline";
import {
  useLines,
  useSDWT,
  useEquipments,
} from "@/features/drilldown/hooks/useLineQueries";
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
  JIRA: "JIRA",
};

export default function TimelinePage() {
  const params = useParams();
  const navigate = useNavigate();
  const { lineId, sdwtId, eqpId, setLine, setSdwt, setEqp } =
    useSelectionStore();

  // 검증 상태
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // 검증용 데이터 가져오기
  const { data: lines = [] } = useLines();
  const { data: sdwts = [] } = useSDWT(params.lineId || lineId);
  const { data: eqps = [] } = useEquipments(
    params.lineId || lineId,
    params.sdwtId || sdwtId
  );

  // URL 파라미터로 접속했는지 추적
  const [isUrlInitialized, setIsUrlInitialized] = useState(false);

  // URL 파라미터 검증 및 설정
  useEffect(() => {
    const validateAndSetParams = async () => {
      if (params.lineId && params.sdwtId && params.eqpId) {
        setIsValidating(true);
        setValidationError(null);
        setIsUrlInitialized(true); // URL로 접속했음을 표시

        // 일단 파라미터 값을 스토어에 설정 (드롭다운에 표시되도록)
        setLine(params.lineId);
        setSdwt(params.sdwtId);
        setEqp(params.eqpId);

        try {
          // 데이터가 로드될 때까지 대기
          let retryCount = 0;
          const maxRetries = 10;

          while (retryCount < maxRetries) {
            // 1. Line ID 검증
            if (lines.length > 0) {
              const validLine = lines.find((l) => l.id === params.lineId);
              if (!validLine) {
                throw new Error(
                  `라인 ID "${params.lineId}"를 찾을 수 없습니다.`
                );
              }

              // 2. SDWT ID 검증
              if (sdwts.length > 0) {
                const validSdwt = sdwts.find((s) => s.id === params.sdwtId);
                if (!validSdwt) {
                  throw new Error(
                    `SDWT ID "${params.sdwtId}"를 찾을 수 없습니다.`
                  );
                }

                // 3. EQP ID 검증
                if (eqps.length > 0) {
                  const validEqp = eqps.find((e) => e.id === params.eqpId);
                  if (!validEqp) {
                    throw new Error(
                      `EQP ID "${params.eqpId}"를 찾을 수 없습니다.`
                    );
                  }

                  // 모든 검증 통과
                  setIsValidating(false);
                  return;
                }
              }
            }

            // 데이터가 아직 로드되지 않았으면 잠시 대기
            await new Promise((resolve) => setTimeout(resolve, 300));
            retryCount++;
          }

          // 최대 재시도 횟수 초과 시에도 검증 종료
          setIsValidating(false);
        } catch (error) {
          setValidationError(error.message);
          // 에러 발생 시 스토어 초기화
          setLine("");
          setSdwt("");
          setEqp("");
          // 3초 후 기본 페이지로 이동
          setTimeout(() => {
            navigate("/timeline");
          }, 3000);
        }
      } else {
        // URL 파라미터가 없으면 초기화 완료로 표시
        setIsUrlInitialized(true);
      }
    };

    if (!isUrlInitialized) {
      validateAndSetParams();
    }
  }, [
    params.lineId,
    params.sdwtId,
    params.eqpId,
    lines,
    sdwts,
    eqps,
    isUrlInitialized,
  ]);

  // 선택값이 변경되면 URL 업데이트
  useEffect(() => {
    // 검증 중이거나 URL 초기화가 안됐으면 업데이트하지 않음
    if (isValidating || !isUrlInitialized) return;

    // 현재 경로 확인
    const currentPath = window.location.pathname;
    const isParamRoute =
      currentPath.includes("/timeline/") && currentPath.split("/").length > 3;

    if (lineId && sdwtId && eqpId) {
      // 모든 값이 선택된 경우: URL에 파라미터 추가
      const newPath = `/timeline/${lineId}/${sdwtId}/${eqpId}`;
      if (currentPath !== newPath) {
        navigate(newPath, { replace: true });
      }
    } else {
      // 하나라도 선택 해제된 경우: 기본 timeline 경로로
      if (isParamRoute) {
        navigate("/timeline", { replace: true });
      }
    }
  }, [lineId, sdwtId, eqpId, navigate, isValidating, isUrlInitialized]);

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
    [DATA_TYPES.JIRA]: true,
  });
  const handleFilter = (e) =>
    setTypeFilters((p) => ({ ...p, [e.target.name]: e.target.checked }));

  const logsByType = useMemo(() => {
    const g = { EQP: [], TIP: [], RACB: [], CTTTM: [], JIRA: [] };
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

          <div className="flex gap-2 items-center">
            {/* URL 공유 버튼 추가 */}
            {lineId && sdwtId && eqpId && <ShareButton />}

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

// 3. URL 공유 기능 컴포넌트
const ShareButton = () => {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      // 네이티브 공유 API 지원 확인 (모바일)
      if (navigator.share) {
        await navigator.share({
          title: "EQP Timeline",
          text: "타임라인 링크를 공유합니다",
          url: url,
        });
      } else {
        // 클립보드에 복사
        await navigator.clipboard.writeText(url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("URL 공유 실패:", err);
      // 폴백: 구식 방법으로 복사
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        title="현재 페이지 URL 공유"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-2.684-4.026m-9.032 0a3 3 0 102.684 4.026m9.032-4.026a3 3 0 10-2.684 4.026"
          />
        </svg>
        공유
      </button>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          URL이 클립보드에 복사되었습니다!
        </div>
      )}
    </>
  );
};
