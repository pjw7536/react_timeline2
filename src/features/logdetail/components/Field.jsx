// src/features/table/components/logDetails/Field.jsx
import React from "react";
import StreamingText from "./StreamingText";

/**
 * 필드 공통 출력 컴포넌트
 */
export default function Field({
  label,
  value,
  className = "",
  streaming = false,
}) {
  return (
    <>
      <div
        className={`font-semibold text-slate-700 dark:text-slate-200 ${className}`}
      >
        {label}
      </div>
      <div>
        {streaming ? <StreamingText text={value || "-"} /> : value || "-"}
      </div>
    </>
  );
}
