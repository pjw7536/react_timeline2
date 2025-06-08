// src/features/timeline/components/DataLogSection.jsx
import React from "react";
import CombinedDataTable from "@/features/table/CombinedDataTable";
import LoadingSpinner from "@/shared/LoadingSpinner";

export default function DataLogSection({
  eqpId,
  logsLoading,
  tableData,
  typeFilters,
  handleFilter,
}) {
  return (
    <section className="bg-white dark:bg-slate-800 shadow rounded-xl p-3 flex-[3] min-h-0 flex flex-col overflow-auto">
      {!eqpId && !logsLoading ? (
        <p className="text-center text-slate-600 dark:text-slate-400 py-10">
          EQP를 선택하세요.
        </p>
      ) : logsLoading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <CombinedDataTable
          data={tableData}
          typeFilters={typeFilters}
          handleFilter={handleFilter}
        />
      )}
    </section>
  );
}
