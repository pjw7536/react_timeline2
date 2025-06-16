// src/features/timeline/components/TimelineBoard.jsx
import EqpTimeline from "./EqpTimeline";
import TipTimeline from "./TipTimeline";
import CtttmTimeline from "./CtttmTimeline";
import RacbTimeline from "./RacbTimeline";
import JiraTimeline from "./JiraTimeline";
import { useTimelineRange } from "../hooks/useTimelineRange";
import { useMemo } from "react";

export default function TimelineBoard({
  lineId,
  eqpId,
  showLegend,
  selectedTipGroups,
  eqpLogs = [],
  tipLogs = [],
  ctttmLogs = [],
  racbLogs = [],
  jiraLogs = [],
}) {
  // 모든 로그를 합쳐서 range 계산
  const allLogs = [
    ...eqpLogs,
    ...tipLogs,
    ...ctttmLogs,
    ...racbLogs,
    ...jiraLogs,
  ];
  const range = useTimelineRange(allLogs);

  // 마지막에 표시될 타임라인 확인 (시간축 표시용)
  const lastVisibleTimeline = useMemo(() => {
    if (jiraLogs.length > 0) return "jira";
    if (racbLogs.length > 0) return "racb";
    if (ctttmLogs.length > 0) return "ctttm";
    if (tipLogs.length > 0) return "tip";
    if (eqpLogs.length > 0) return "eqp";
    return null;
  }, [eqpLogs, tipLogs, ctttmLogs, racbLogs, jiraLogs]);

  // 아무 데이터도 없는 경우
  if (allLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        표시할 로그 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div
      className="w-full space-y-0"
      style={{ position: "relative", zIndex: 1 }}
    >
      {eqpLogs.length > 0 && (
        <EqpTimeline
          lineId={lineId}
          eqpId={eqpId}
          range={range}
          showLegend={showLegend}
          showTimeAxis={lastVisibleTimeline === "eqp"}
          eqpLogs={eqpLogs}
        />
      )}

      {tipLogs.length > 0 && (
        <TipTimeline
          lineId={lineId}
          eqpId={eqpId}
          range={range}
          showLegend={showLegend}
          selectedTipGroups={selectedTipGroups}
          showTimeAxis={lastVisibleTimeline === "tip"}
          tipLogs={tipLogs}
        />
      )}

      {ctttmLogs.length > 0 && (
        <CtttmTimeline
          lineId={lineId}
          eqpId={eqpId}
          range={range}
          showLegend={showLegend}
          showTimeAxis={lastVisibleTimeline === "ctttm"}
          ctttmLogs={ctttmLogs}
        />
      )}

      {racbLogs.length > 0 && (
        <RacbTimeline
          lineId={lineId}
          eqpId={eqpId}
          range={range}
          showLegend={showLegend}
          showTimeAxis={lastVisibleTimeline === "racb"}
          racbLogs={racbLogs}
        />
      )}

      {jiraLogs.length > 0 && (
        <JiraTimeline
          lineId={lineId}
          eqpId={eqpId}
          range={range}
          showLegend={showLegend}
          showTimeAxis={lastVisibleTimeline === "jira"}
          jiraLogs={jiraLogs}
        />
      )}
    </div>
  );
}
