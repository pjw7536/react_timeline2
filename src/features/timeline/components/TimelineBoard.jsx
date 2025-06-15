import EqpTimeline from "./EqpTimeline";
import TipTimeline from "./TipTimeline";
import EventTimeline from "./EventTimeline";
import { useTimelineRange } from "../hooks/useTimelineRange";

export default function TimelineBoard({
  lineId,
  eqpId,
  showLegend,
  selectedTipGroups,
  // 새로 추가: 각 타임라인의 로그 데이터를 props로 받기
  eqpLogs = [],
  tipLogs = [],
  eventLogs = [],
}) {
  // 모든 로그를 합쳐서 범위 계산
  const allLogs = [...eqpLogs, ...tipLogs, ...eventLogs];
  const range = useTimelineRange(allLogs);

  return (
    <div className="w-full space-y-0">
      <EqpTimeline
        lineId={lineId}
        eqpId={eqpId}
        range={range}
        showLegend={showLegend}
        showTimeAxis={false}
        eqpLogs={eqpLogs} // 데이터를 props로 전달
      />

      <TipTimeline
        lineId={lineId}
        eqpId={eqpId}
        range={range}
        showLegend={showLegend}
        selectedTipGroups={selectedTipGroups}
        showTimeAxis={false}
        tipLogs={tipLogs} // 데이터를 props로 전달
      />

      <EventTimeline
        lineId={lineId}
        eqpId={eqpId}
        range={range}
        showLegend={showLegend}
        showTimeAxis={true}
        eventLogs={eventLogs} // 데이터를 props로 전달
      />
    </div>
  );
}
