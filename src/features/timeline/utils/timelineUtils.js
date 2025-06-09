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

/**
 * TIP 데이터를 process, step, ppid로 서브그룹화
 * @param {Array} tipData - TIP 로그 데이터
 * @returns {{groups: Array, items: Array}} - 그룹과 아이템 배열
 */
export const processTipDataWithSubgroups = (tipData) => {
  const subgroupMap = new Map();
  const items = [];

  // TIP 데이터를 순회하며 서브그룹 생성
  tipData.forEach((log) => {
    // 서브그룹 키 생성 (process_step_ppid)
    const process = log.process || "unknown";
    const step = log.step || "unknown";
    const ppid = log.ppid || "unknown";
    const subgroupKey = `TIP_${process}_${step}_${ppid}`;

    if (!subgroupMap.has(subgroupKey)) {
      subgroupMap.set(subgroupKey, {
        id: subgroupKey,
        content: `<div class="tip-subgroup-label">
          <span class="process">${process}</span>
          <span class="separator">/</span>
          <span class="step">${step}</span>
          <span class="separator">/</span>
          <span class="ppid">${ppid}</span>
        </div>`,
        className: "tip-subgroup",
        treeLevel: 2, // TIP의 하위 레벨
        showNested: false, // 기본적으로 접힌 상태
      });
    }

    // 아이템 생성
    const start = new Date(log.eventTime);
    const end = log.endTime ? new Date(log.endTime) : start;
    const isRange = !!log.endTime;
    const cfg = groupConfig.TIP;
    const colorCls = cfg.stateColors[log.eventType] || "bg-gray-300";

    items.push({
      id: log.id,
      group: subgroupKey, // 서브그룹에 할당
      content: `<span style="font-size: 11px; font-weight: 500;">${
        log.eventType || ""
      }</span>`,
      start,
      end,
      type: isRange ? "range" : "point",
      className: colorCls,
      title: [
        `Process: ${process}`,
        `Step: ${step}`,
        `PPID: ${ppid}`,
        log.comment,
        log.operator ? `👤 ${log.operator}` : null,
        log.url ? `🔗 ${log.url}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      // 원본 데이터 보존 (선택 시 필요)
      originalData: log,
    });
  });

  // 서브그룹을 정렬 (process -> step -> ppid 순)
  const sortedGroups = Array.from(subgroupMap.values()).sort((a, b) => {
    const [, processA, stepA, ppidA] = a.id.split("_");
    const [, processB, stepB, ppidB] = b.id.split("_");

    if (processA !== processB) return processA.localeCompare(processB);
    if (stepA !== stepB) return stepA.localeCompare(stepB);
    return ppidA.localeCompare(ppidB);
  });

  return {
    groups: sortedGroups,
    items,
  };
};

/** ±1일 버퍼 (기존 3일에서 1일로 축소) */
export const addBuffer = (min, max) => {
  const B = 1 * 24 * 60 * 60 * 1000; // 1일
  return { min: new Date(min - B), max: new Date(max + B) };
};

/** 전체 로그 범위 계산 - eventTime만 사용하도록 수정 */
export const calcRange = (logs) => {
  // eventTime만 추출 (endTime 제외)
  const eventTimes = logs
    .filter((l) => l && l.eventTime)
    .map((l) => new Date(l.eventTime).getTime())
    .filter((time) => !isNaN(time));

  if (!eventTimes.length) {
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

  // eventTime의 최소값과 최대값
  const minTime = Math.min(...eventTimes);
  const maxTime = Math.max(...eventTimes);

  return { min: new Date(minTime), max: new Date(maxTime) };
};
