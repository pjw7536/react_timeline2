import React, { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { processData } from "@/features/timeline/utils/timelineUtils";
import { useSelectionStore } from "@/shared/store";
import Legend from "./Legend";

/**
 * EQP_LOG + TIP_LOG 를 stack 없이 나란히 보여주는 타임라인
 */
export default function NonStackedTimeline({ dataMap, range }) {
  const containerRef = useRef(null);
  const tlRef = useRef(null); // 인스턴스 보관

  // 전역 선택/동기화 스토어
  const { selectedRow, setSelectedRow, register, unregister, syncRange } =
    useSelectionStore();

  // 1️⃣ 생성 Effect – 의존성 []
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { Timeline } = await import("vis-timeline/standalone");
      if (!mounted || !containerRef.current) return;

      /* 그룹 & 아이템 */
      const groups = [
        { id: "EQP", content: "EQP 상태", className: "custom-group-label" },
        { id: "TIP", content: "TIP 상태", className: "custom-group-label" },
      ];
      const items = new DataSet(
        groups.flatMap((g) => processData(g.id, dataMap[g.id] || []))
      );

      /* 인스턴스 생성 */
      tlRef.current = new Timeline(containerRef.current, items, groups, {
        stack: false,
        min: range.min,
        max: range.max,
        zoomMin: 60 * 1000,
        margin: { item: 0, axis: 0 },
        groupOrder: (a, b) =>
          ["EQP", "TIP"].indexOf(a.id) - ["EQP", "TIP"].indexOf(b.id),
        selectable: true,
      });

      register(tlRef.current);

      /* X축 동기화 */
      tlRef.current.on("rangechange", ({ start, end }) =>
        syncRange(tlRef.current, start, end)
      );

      /* 아이템 선택 → 전역 상태로 전파 */
      tlRef.current.on("select", ({ items }) =>
        setSelectedRow(items?.[0] ?? null, "timeline")
      );
    })();

    return () => {
      mounted = false;
      if (tlRef.current) {
        unregister(tlRef.current);
        tlRef.current.destroy();
      }
    };
  }, []); // 빈 배열

  /* 2️⃣ 데이터 바뀔 때 아이템만 교체 */
  useEffect(() => {
    if (tlRef.current) {
      const items = new DataSet(
        ["EQP", "TIP"].flatMap((id) => processData(id, dataMap[id] || []))
      );
      tlRef.current.setItems(items);
    }
  }, [dataMap]);

  /* 3️⃣ 선택 동기화 */
  useEffect(() => {
    if (tlRef.current) {
      if (selectedRow && tlRef.current.itemsData.get(selectedRow)) {
        tlRef.current.setSelection([selectedRow]);
      } else {
        tlRef.current.setSelection([]);
      }
    }
  }, [selectedRow]);

  return (
    <div className="timeline-container relative">
      <h3 className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
        ⛓ EQP + TIP 로그
      </h3>
      <div ref={containerRef} className="timeline" />
      <Legend logTypes={["EQP", "TIP"]} />
    </div>
  );
}
