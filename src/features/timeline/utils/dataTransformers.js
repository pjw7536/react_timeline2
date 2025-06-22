// src/features/timeline/utils/dataTransformers.js
import { formatDateTime } from "@features/timeline/utils/dateUtils";

export function transformLogsToTableData(logs, typeFilters) {
  // 먼저 로그를 타입별로 그룹화하고 시간순 정렬
  const logsByType = {};
  logs.forEach((log) => {
    if (!logsByType[log.logType]) {
      logsByType[log.logType] = [];
    }
    logsByType[log.logType].push(log);
  });

  // 각 타입별로 시간순 정렬 (오래된 것부터)
  Object.keys(logsByType).forEach((type) => {
    logsByType[type].sort(
      (a, b) => new Date(a.eventTime) - new Date(b.eventTime)
    );
  });

  const transformed = logs
    .filter((log) => typeFilters[log.logType])
    .map((log) => {
      let duration = "-";

      // EQP와 TIP 로그에 대해서만 duration 계산
      if (
        (log.logType === "EQP" || log.logType === "TIP") &&
        logsByType[log.logType]
      ) {
        const typeSpecificLogs = logsByType[log.logType];
        const currentIndex = typeSpecificLogs.findIndex((l) => l.id === log.id);

        if (currentIndex !== -1 && currentIndex < typeSpecificLogs.length - 1) {
          // 현재 로그의 종료 시간 = 다음 로그의 시작 시간
          const nextLog = typeSpecificLogs[currentIndex + 1];
          const startTime = new Date(log.eventTime).getTime();
          const endTime = new Date(nextLog.eventTime).getTime();
          const durationMs = endTime - startTime;

          if (durationMs > 0) {
            // HH:MM:SS 형식으로 변환
            const totalSeconds = Math.floor(durationMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            duration = [
              hours.toString().padStart(2, "0"),
              minutes.toString().padStart(2, "0"),
              seconds.toString().padStart(2, "0"),
            ].join(":");
          }
        } else if (currentIndex === typeSpecificLogs.length - 1) {
          // 마지막 로그의 경우 현재 시간까지
          const startTime = new Date(log.eventTime).getTime();
          const now = new Date();
          const endTime = now.getTime();
          const durationMs = endTime - startTime;

          if (durationMs > 0) {
            const totalSeconds = Math.floor(durationMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            duration = [
              hours.toString().padStart(2, "0"),
              minutes.toString().padStart(2, "0"),
              seconds.toString().padStart(2, "0"),
            ].join(":");
          }
        }
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
    .sort((a, b) => b.timestamp - a.timestamp); // 최신 순으로 정렬

  return transformed;
}
