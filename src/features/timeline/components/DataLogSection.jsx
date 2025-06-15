// src/features/timeline/components/DataLogSection.jsx
import React from "react";
import VirtualizedDataTable from "@features/table/components/VirtualizedDataTable";
import { LoadingSpinner } from "@shared/components";

export default function DataLogSection({
  eqpId,
  logsLoading,
  tableData,
  typeFilters,
  handleFilter,
}) {
  return (
    <section className="bg-white dark:bg-slate-800 shadow rounded-xl p-3 flex-[2] min-h-0 flex flex-col overflow-hidden">
      {!eqpId && !logsLoading ? (
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 py-45">
          EQP를 선택하세요.
        </p>
      ) : logsLoading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <VirtualizedDataTable
          data={tableData}
          typeFilters={typeFilters}
          handleFilter={handleFilter}
        />
      )}
    </section>
  );
}
