// src/features/timeline/components/LogViewerSection.jsx
import React from "react";
import { LineSelector, SDWTSelector, EqpSelector } from "@features/drilldown";
import PrcGroupSelector from "@features/drilldown/PrcGroupSelector";

export default function LogViewerSection({
  lineId,
  sdwtId,
  prcGroup,
  eqpId,
  setLine,
  setSdwt,
  setPrcGroup,
  setEqp,
}) {
  return (
    <section className="bg-white dark:bg-slate-800 shadow rounded-xl p-3 flex flex-col">
      <h2 className="text-md font-bold text-slate-900 dark:text-white border-slate-200 dark:border-slate-700">
        📊 Log Viewer
      </h2>
      <div className="grid grid-cols-4 gap-2 mt-2">
        <LineSelector lineId={lineId} setLineId={setLine} />
        <SDWTSelector lineId={lineId} sdwtId={sdwtId} setSdwtId={setSdwt} />
        <PrcGroupSelector
          lineId={lineId}
          sdwtId={sdwtId}
          prcGroup={prcGroup}
          setPrcGroup={setPrcGroup}
        />
        <EqpSelector
          lineId={lineId}
          sdwtId={sdwtId}
          prcGroup={prcGroup}
          eqpId={eqpId}
          setEqpId={setEqp}
        />
      </div>
    </section>
  );
}
