import React, { useEffect, useMemo, useRef } from "react";
import { DataSet } from "vis-data";
import {
  processData,
  calcRange,
  addBuffer,
} from "@/features/timeline/utils/timelineUtils";
import { useSelectionStore } from "@/shared/store";
import { makeGroupLabel } from "@/features/timeline/utils/groupLabel";

/**
 * CTTTM_LOG + RACB_LOG 를 stack=true 로 보여주는 타임라인
 */
export default function StackedTimeline({ dataMap, showLegend }) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  const { selectedRow, setSelectedRow, register, unregister, syncRange } =
    useSelectionStore();

  /* 그룹 정의 */
  const groups = useMemo(
    () => [
      {
        id: "CTTTM",
        content: makeGroupLabel("CTTTM", "CTTTM 이벤트", showLegend),
        height: 150,
        style: "height: 200px", // ← 꼭 추가!
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
      },
      {
        id: "RACB",
        content: makeGroupLabel("RACB", "RACB 이벤트", showLegend),
        height: 150,
        style: "height: 200px", // ← 꼭 추가!
        className: showLegend
          ? "custom-group-label legend-mode"
          : "custom-group-label",
      },
    ],
    [showLegend]
  );

  /* 전체 범위 */
  const range = useMemo(() => {
    const all = [...(dataMap.CTTTM || []), ...(dataMap.RACB || [])];
    const { min, max } = calcRange(all);
    return addBuffer(min.getTime(), max.getTime());
  }, [dataMap]);

  /* 1️⃣ 최초 mount 때만 인스턴스 생성 */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { Timeline } = await import("vis-timeline/standalone");
      if (!mounted || !containerRef.current) return;

      const items = new DataSet(
        groups.flatMap((g) => processData(g.id, dataMap[g.id] || []))
      );

      tlRef.current = new Timeline(containerRef.current, items, groups, {
        stack: true,
        min: range.min,
        max: range.max,
        zoomMin: 60 * 1000,
        verticalScroll: true,
        groupHeightMode: "fixed",
        groupHeights: { CTTTM: 200, RACB: 200 }, // 원하는대로
        groupOrder: (a, b) =>
          ["CTTTM", "RACB"].indexOf(a.id) - ["CTTTM", "RACB"].indexOf(b.id),
      });

      register(tlRef.current);
      tlRef.current.on("rangechange", ({ start, end }) =>
        syncRange(tlRef.current, start, end)
      );
      tlRef.current.on("select", ({ items }) => {
        // 최신 selectedRow 참조
        const currentSelected = useSelectionStore.getState().selectedRow;

        if (items && items.length > 0) {
          if (String(currentSelected) === String(items[0])) {
            setSelectedRow(null, "timeline");
            tlRef.current.setSelection([]); // 타임라인도 해제!
          } else {
            setSelectedRow(items[0], "timeline");
          }
        } else {
          setSelectedRow(null, "timeline");
        }
      });
    })();

    return () => {
      mounted = false;
      if (tlRef.current) {
        unregister(tlRef.current);
        tlRef.current.destroy();
      }
    };
  }, []); // ← 의존성 배열 **빈 배열** (once)

  /* 2️⃣ 데이터가 바뀌면 아이템만 교체 */
  useEffect(() => {
    if (tlRef.current) {
      const items = new DataSet(
        groups.flatMap((g) => processData(g.id, dataMap[g.id] || []))
      );
      tlRef.current.setItems(items);
    }
  }, [dataMap, groups]);

  /* 3️⃣ 외부(Table) 선택 반영 */
  useEffect(() => {
    if (tlRef.current) {
      if (selectedRow && tlRef.current.itemsData.get(selectedRow)) {
        tlRef.current.setSelection([selectedRow]);
      } else {
        tlRef.current.setSelection([]);
      }
    }
  }, [selectedRow]);

  useEffect(() => {
    if (tlRef.current) {
      tlRef.current.setGroups(groups); // showLegend 변화 시 그룹 갱신!
    }
  }, [groups]);

  return (
    <div className="timeline-container">
      <h3 className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
        📍 CTTTM + RACB 로그
      </h3>
      <div
        ref={containerRef}
        className="timeline"
        style={{ height: "550px", overflow: "hidden" }}
      />
    </div>
  );
}
