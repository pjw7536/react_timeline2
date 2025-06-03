import React, { useRef, useState, useEffect } from "react";
import { groupConfig } from "@/features/timeline/utils/timelineMeta";

/**
 * 드래그 가능한 범례 컴포넌트
 * @param {string[]} logTypes
 */
export default function Legend({ logTypes }) {
  const legendRef = useRef(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    // legend 기준 offset 계산
    const rect = legendRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setDragging(true);
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={legendRef}
      onMouseDown={onMouseDown}
      className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow px-3 py-2 text-sm space-y-1 cursor-move fixed z-50"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        userSelect: "none",
      }}
    >
      {logTypes.map((type) => {
        const config = groupConfig[type];
        if (!config) return null;
        return Object.entries(config.stateColors).map(([event, cls]) => (
          <div key={`${type}-${event}`} className="flex items-center gap-2">
            <span className={`w-4 h-4 inline-block rounded ${cls}`} />
            <span className="text-slate-800 dark:text-slate-100">
              {type.replace("_LOG", "")} - {event}
            </span>
          </div>
        ));
      })}
    </div>
  );
}
