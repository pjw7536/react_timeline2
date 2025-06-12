import EqpTimeline from "./EqpTimeline";
import TipTimeline from "./TipTimeline";
import EventTimeline from "./EventTimeline";
import { useTimelineRange } from "../hooks/useTimelineRange";

export default function TimelineBoard({
  lineId,
  eqpId,
  showLegend,
  selectedTipGroups,
}) {
  const range = useTimelineRange(lineId, eqpId);

  return (
    <div className="w-full space-y-0">
      <EqpTimeline
        lineId={lineId}
        eqpId={eqpId}
        range={range}
        showLegend={showLegend}
        showTimeAxis={false}
      />

      <TipTimeline
        lineId={lineId}
        eqpId={eqpId}
        range={range}
        showLegend={showLegend}
        selectedTipGroups={selectedTipGroups}
        showTimeAxis={false}
      />

      <EventTimeline
        lineId={lineId}
        eqpId={eqpId}
        range={range}
        showLegend={showLegend}
        showTimeAxis={true}
      />
    </div>
  );
}
