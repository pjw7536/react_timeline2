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

      return {
        id: l.id,
        group: logType,
        content: l.comment || "",
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
    // 이벤트가 없을 때 일관된 기본 범위 제공 (오늘 00:00 ~ 23:59)
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
