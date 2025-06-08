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
  return logs
    .map((log) => ({
      id: log.id,
      timestamp: new Date(log.eventTime).getTime(),
      displayTimestamp: formatDateTime(log.eventTime),
      logType: log.logType,
      info1: log.eventType,
      info2: log.operator || "-",
      duration: log.duration?.toFixed(0) ?? "-",
    }))
    .filter((row) => typeFilters[row.logType])
    .sort((a, b) => b.timestamp - a.timestamp);
}
