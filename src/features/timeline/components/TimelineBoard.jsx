// src/features/timeline/components/TimelineBoard.jsx
import EqpTimeline from "./EqpTimeline";
import TipTimeline from "./TipTimeline";
import EventTimeline from "./EventTimeline";
import { useTimelineRange } from "../hooks/useTimelineRange";

export default function TimelineBoard({
  lineId,
  eqpId,
  showLegend,
  selectedTipGroups,
  eqpLogs = [],
  tipLogs = [],
  eventLogs = [],
}) {
  const allLogs = [...eqpLogs, ...tipLogs, ...eventLogs];
  const range = useTimelineRange(allLogs);

  return (
    <div
      className="w-full space-y-0"
      style={{ position: "relative", zIndex: 1 }}
    >
      <EqpTimeline
        lineId={lineId}
        eqpId={eqpId}
        range={range}
        showLegend={showLegend}
        showTimeAxis={false}
        eqpLogs={eqpLogs}
      />

      <TipTimeline
        lineId={lineId}
        eqpId={eqpId}
        range={range}
        showLegend={showLegend}
        selectedTipGroups={selectedTipGroups}
        showTimeAxis={false}
        tipLogs={tipLogs}
      />

      <EventTimeline
        lineId={lineId}
        eqpId={eqpId}
        range={range}
        showLegend={showLegend}
        showTimeAxis={true}
        eventLogs={eventLogs}
      />
    </div>
  );
}
