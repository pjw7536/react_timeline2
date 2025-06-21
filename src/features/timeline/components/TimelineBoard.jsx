// src/features/timeline/components/TimelineBoard.jsx
import React from "react";
import EqpTimeline from "./EqpTimeline";
import TipTimeline from "./TipTimeline";
import CtttmTimeline from "./CtttmTimeline";
import RacbTimeline from "./RacbTimeline";
import JiraTimeline from "./JiraTimeline";
import { useTimelineRange } from "../hooks/useTimelineRange";

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

  // 아무 데이터도 없는 경우
  if (allLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        표시할 로그 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* 타임라인이 많아질 때를 위한 스크롤 컨테이너 */}
      <div
        className="w-full h-full overflow-y-auto space-y-0 scroll-smooth pr-5"
        style={{ position: "relative", zIndex: 1 }}
      >
        {eqpLogs.length > 0 && (
          <EqpTimeline
            lineId={lineId}
            eqpId={eqpId}
            range={range}
            showLegend={showLegend}
            showTimeAxis={true}
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
            showTimeAxis={true}
            tipLogs={tipLogs}
          />
        )}
        {ctttmLogs.length > 0 && (
          <CtttmTimeline
            lineId={lineId}
            eqpId={eqpId}
            range={range}
            showLegend={showLegend}
            showTimeAxis={true}
            ctttmLogs={ctttmLogs}
          />
        )}
        {racbLogs.length > 0 && (
          <RacbTimeline
            lineId={lineId}
            eqpId={eqpId}
            range={range}
            showLegend={showLegend}
            showTimeAxis={true}
            racbLogs={racbLogs}
          />
        )}
        {jiraLogs.length > 0 && (
          <JiraTimeline
            lineId={lineId}
            eqpId={eqpId}
            range={range}
            showLegend={showLegend}
            showTimeAxis={true}
            jiraLogs={jiraLogs}
          />
        )}
      </div>
    </div>
  );
}
