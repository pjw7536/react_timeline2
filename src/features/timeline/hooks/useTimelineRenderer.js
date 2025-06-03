import { useEffect, useRef } from "react";
import { processData } from "@/features/timeline/utils/timelineUtils";
import { useSelectionStore } from "@/shared/store";
import { DataSet as VisDataSet } from "vis-data"; // ✅

export const useTimelineRenderer = (containerRef, groupKey, data, options) => {
  const tlRef = useRef(null);
  const { register, unregister, syncRange, setSelectedRow } =
    useSelectionStore();

  /* 1. 최초 생성 */
  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;
    (async () => {
      const { Timeline } = await import(
        /* webpackChunkName: "vis-timeline" */ "vis-timeline/standalone"
      );
      if (!mounted) return;

      const items = new VisDataSet(processData(groupKey, data)); // ✅
      tlRef.current = new Timeline(containerRef.current, items, options);

      register(tlRef.current);

      tlRef.current.on("rangechange", ({ start, end }) =>
        syncRange(tlRef.current, start, end)
      );

      tlRef.current.on("select", (e) => {
        const id = e.items?.[0];
        if (id) setSelectedRow(id, "timeline");
      });
    })();

    return () => {
      mounted = false;
      if (tlRef.current) {
        unregister(tlRef.current);
        tlRef.current.destroy();
      }
    };
  }, [groupKey]);

  /* 2. 데이터 변경 시 아이템만 교체 */
  useEffect(() => {
    if (tlRef.current) {
      tlRef.current.setItems(new VisDataSet(processData(groupKey, data))); // ✅
    }
  }, [data]);

  return tlRef;
};
