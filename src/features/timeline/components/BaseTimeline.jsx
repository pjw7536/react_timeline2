import React, { useRef, useMemo } from "react";
import { useVisTimeline } from "../hooks/useVisTimeline";

/**
 * 재사용 가능한 기본 Timeline 컴포넌트
 * @param {Object} props
 * @param {Array} props.groups - 타임라인 그룹 정의
 * @param {Array} props.items - 타임라인 아이템
 * @param {Object} props.options - vis-timeline 옵션
 * @param {string} props.title - 타임라인 제목
 * @param {ReactNode} props.headerExtra - 헤더 추가 요소
 * @param {boolean} props.showTimeAxis - x축 표시 여부
 */
export default function BaseTimeline({
  groups,
  items,
  options = {},
  title,
  headerExtra,
  className = "",
  style = {},
  showTimeAxis = true,
  height,
  minHeight,
  maxHeight,
}) {
  const containerRef = useRef(null);

  const mergedOptions = useMemo(
    () => ({
      margin: { item: 0, axis: 0 },
      groupOrder: "order",
      selectable: true,
      verticalScroll: true,
      tooltip: {
        followMouse: true,
        overflowMethod: "flip",
      },
      showMajorLabels: showTimeAxis,
      showMinorLabels: showTimeAxis,
      align: "center",
      orientation: {
        item: "center",
      },

      height: height,
      minHeight: minHeight || 20,
      maxHeight: maxHeight || 400,
      ...options,
    }),
    [options, showTimeAxis, height, minHeight, maxHeight]
  );

  useVisTimeline({
    containerRef,
    groups,
    items,
    options: mergedOptions,
  });

  // 동적 스타일 계산
  const containerStyle = useMemo(() => {
    const baseStyle = {
      ...style,
    };

    return baseStyle;
  }, [style]);

  return (
    <div
      className={`timeline-container relative ${className} ${
        !showTimeAxis ? "no-time-axis" : ""
      }`}
    >
      {(title || headerExtra) && (
        <div className="flex items-center justify-between mb-1">
          {title && (
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {title}
            </h3>
          )}
          {headerExtra}
        </div>
      )}

      <div ref={containerRef} className="timeline" style={containerStyle} />
    </div>
  );
}
