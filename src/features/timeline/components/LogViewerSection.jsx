// src/features/timeline/components/LogViewerSection.jsx
import React from "react";
import { LineSelector, SDWTSelector, EqpSelector } from "@/features/drilldown";

export default function LogViewerSection({
  lineId,
  sdwtId,
  eqpId,
  setLine,
  setSdwt,
  setEqp,
}) {
  return (
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
  );
}
