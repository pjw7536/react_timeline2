// src/features/timeline/utils/dataTransformers.js
import { formatDateTime } from "@/shared/dateUtils";

export function groupLogsByType(logs) {
  const groups = { EQP: [], TIP: [], RACB: [], CTTTM: [], JIRA: [] };
  logs.forEach((log) => {
    if (groups[log.logType]) {
      groups[log.logType].push(log);
    }
  });
  return groups;
}

export function transformLogsToTableData(logs, typeFilters) {
  const transformed = logs
    .filter((log) => typeFilters[log.logType])
    .map((log) => {
      const row = {
        id: log.id,
        timestamp: new Date(log.eventTime).getTime(),
        displayTimestamp: formatDateTime(log.eventTime),
        logType: log.logType,
        info1: log.eventType,
        info2: log.operator || "-",
        duration: "-", // duration은 더 이상 계산하지 않음
        url: log.url || null,
      };

      // TIP 로그인 경우 process/step 정보 추가 표시
      if (log.logType === "TIP" && (log.process || log.step || log.ppid)) {
        row.info1 = `${log.eventType} (${log.process || "N/A"}/${
          log.step || "N/A"
        })`;
      }

      return row;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return transformed;
}
