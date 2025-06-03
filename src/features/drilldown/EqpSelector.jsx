import React from "react";
import { useEquipments } from "./hooks/useLineQueries";
import LoadingSpinner from "@/shared/LoadingSpinner";

/**
 * EQP 드롭다운
 */
export default function EqpSelector({ lineId, sdwtId, eqpId, setEqpId }) {
  // ① 데이터·상태 가져오기
  const { data: eqps = [], isLoading } = useEquipments(lineId, sdwtId);

  // ② Line 안 고르면 회색 disabled 박스
  if (!lineId)
    return (
      <select
        disabled
        className="w-full px-3 py-1.5 border rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-500"
      >
        <option>EQP 선택…</option>
      </select>
    );

  // ③ fetch 중이면 스피너
  if (isLoading) return <LoadingSpinner />;

  // ④ 정상 렌더
  return (
    <select
      value={eqpId}
      onChange={(e) => setEqpId(e.target.value)} // 상태 lift-up
      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
      disabled={eqps.length === 0}
    >
      <option value="">EQP 선택…</option>
      {eqps.map((e) => (
        <option key={e.id} value={e.id}>
          {e.name}
        </option>
      ))}
    </select>
  );
}
