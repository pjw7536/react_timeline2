import React from "react";

// 필드 공통 출력용
function Field({ label, value, className }) {
  return (
    <>
      <div
        className={
          "font-semibold text-slate-700 dark:text-slate-200 " +
          (className || "")
        }
      >
        {label}
      </div>
      <div>{value}</div>
    </>
  );
}

function UrlField({ url }) {
  return (
    <>
      <div className="font-semibold text-slate-700 dark:text-slate-200">
        URL
      </div>
      <div>
        <a
          href={url}
          className="text-blue-600 dark:text-blue-400 underline break-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
      </div>
    </>
  );
}

// 로그 타입별 렌더러
function renderDetailByType(log) {
  switch (log.logType) {
    case "EQP":
      return (
        <>
          <Field label="ID" value={log.id} />
          <Field label="Log Type" value={log.logType} />
          <Field label="EQP State" value={log.eventType} />
          <Field label="Time" value={log.eventTime} />
          <Field label="End Time" value={log.endTime ?? "-"} />
          <Field label="Operator" value={log.operator ?? "-"} />
          <Field label="Duration" value={log.duration?.toFixed(1) ?? "-"} />
          <Field
            label="Comment"
            value={log.comment ?? "-"}
            className="col-span-2"
          />
        </>
      );
    case "TIP":
      return (
        <>
          <Field label="ID" value={log.id} />
          <Field label="Log Type" value={log.logType} />
          <Field label="TIP Event" value={log.eventType} />
          <Field label="Time" value={log.eventTime} />
          <Field label="Operator" value={log.operator ?? "-"} />
          <Field label="Level" value={log.level ?? "-"} />
          <Field
            label="Comment"
            value={log.comment ?? "-"}
            className="col-span-2"
          />
          {log.url && <UrlField url={log.url} />}
        </>
      );
    case "RACB":
      return (
        <>
          <Field label="ID" value={log.id} />
          <Field label="Log Type" value={log.logType} />
          <Field label="RACB Alarm" value={log.eventType} />
          <Field label="Time" value={log.eventTime} />
          <Field label="Operator" value={log.operator ?? "-"} />
          <Field
            label="Comment"
            value={log.comment ?? "-"}
            className="col-span-2"
          />
          {log.url && <UrlField url={log.url} />}
        </>
      );
    case "CTTTM":
      return (
        <>
          <Field label="ID" value={log.id} />
          <Field label="Log Type" value={log.logType} />
          <Field label="CTTTM" value={log.eventType} />
          <Field label="Time" value={log.eventTime} />
          <Field label="Recipe" value={log.recipe ?? "-"} />
          <Field label="Operator" value={log.operator ?? "-"} />
          <Field label="Duration" value={log.duration?.toFixed(1) ?? "-"} />
          <Field
            label="Comment"
            value={log.comment ?? "-"}
            className="col-span-2"
          />
        </>
      );
    default:
      return (
        <div className="col-span-2 text-slate-500 dark:text-slate-400 py-2">
          알 수 없는 로그 타입입니다.
        </div>
      );
  }
}

/**
 * 선택된 로그 상세정보를 보여주는 컴포넌트
 * @param {Object} log - 상세를 보여줄 로그 객체
 */
export default function LogDetailSection({ log }) {
  if (!log) {
    return (
      <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
        테이블이나 타임라인에서 로그를 선택하면 상세정보가 여기에 표시됩니다.
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm
      bg-white dark:bg-slate-800 rounded-lg p-2
      text-slate-800 dark:text-slate-100 overflow-auto table-scroll"
    >
      {renderDetailByType(log)}
    </div>
  );
}
