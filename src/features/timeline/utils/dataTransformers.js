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
        duration: log.duration?.toFixed(0) ?? "-",
        url: log.url || null, // 여기가 중요!
      };

      // 각 행의 URL 디버깅
      if (log.url) {
        console.log(`Row ${log.id} has URL:`, log.url);
      }

      return row;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return transformed;
}
