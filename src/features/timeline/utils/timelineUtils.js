// src/features/timeline/utils/timelineUtils.js
import { groupConfig } from "./timelineMeta";

/** ➜ 로그 Item.id 생성 (예: RACB_LOG-2025-06-02T12:00:00.000Z) */
export const makeItemId = (group, time) => {
  const iso = new Date(time).toISOString().replace(/\.\d+Z$/, ".000Z");
  return `${group}-${iso}`;
};

/** ➜ vis-timeline 아이템 변환 */
export const processData = (logType, data) => {
  const cfg = groupConfig[logType];
  if (!cfg) return [];

  return data
    .filter((l) => l && l.eventTime)
    .map((l) => {
      const start = new Date(l.eventTime);
      const end = l.endTime ? new Date(l.endTime) : start;
      const isRange = !!l.endTime;
      const colorCls = cfg.stateColors[l.eventType] || "bg-gray-300";

      // 폰트 크기를 logType에 따라 다르게 설정
      const fontSize =
        {
          EQP: "12px",
          TIP: "11px",
          CTTTM: "10px",
          RACB: "10px",
          JIRA: "10px",
        }[logType] || "11px";

      return {
        id: l.id,
        group: logType,
        // HTML로 직접 스타일 적용
        content: `<span style="font-size: ${fontSize}; font-weight: 500;">${
          l.eventType || ""
        }</span>`,
        start,
        end,
        type: isRange ? "range" : "point",
        className: colorCls,
        title: [
          l.comment,
          l.operator ? `👤 ${l.operator}` : null,
          l.url ? `🔗 ${l.url}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      };
    });
};

/** ±3일 버퍼 */
export const addBuffer = (min, max) => {
  const B = 3 * 24 * 60 * 60 * 1000;
  return { min: new Date(min - B), max: new Date(max + B) };
};

/** 전체 로그 범위 계산 */
export const calcRange = (logs) => {
  const ts = logs
    .flatMap((l) => [
      new Date(l.eventTime).getTime(),
      l.endTime ? new Date(l.endTime).getTime() : undefined,
    ])
    .filter(Boolean);

  if (!ts.length) {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );
    return { min: startOfDay, max: endOfDay };
  }
  return { min: new Date(Math.min(...ts)), max: new Date(Math.max(...ts)) };
};
