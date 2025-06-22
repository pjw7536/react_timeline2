// src/features/timeline/utils/dataTransformers.js
import { formatDateTime } from "@features/timeline/utils/dateUtils";
export function transformLogsToTableData(logs, typeFilters) {
  const transformed = logs
    .filter((log) => typeFilters[log.logType])
    .map((log) => {
      let duration = "-";

      // 이미 계산된 duration 사용
      if (log.duration && log.duration > 0) {
        const totalSeconds = Math.floor(log.duration / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        duration = [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0"),
        ].join(":");
      }

      const row = {
        id: log.id,
        timestamp: new Date(log.eventTime).getTime(),
        displayTimestamp: formatDateTime(log.eventTime),
        logType: log.logType,
        info1: log.eventType,
        info2: log.operator || "-",
        duration: duration,
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
