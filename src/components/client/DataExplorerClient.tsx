"use client";
import React, { useState } from "react";
import { getCoreRowModel, useReactTable, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { ITypeParsedOmpData } from "@/types/data";
import { Filters } from "@/components/client/Filters";
import { Table } from "@/components/client/Table";
import { columns } from "@/components/client/Columns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedDimensions, setSelectedMetrics, setDateRange } from "@/store/slices/dataExplorerSlice";

interface DataExplorerClientProps {
  initialData: ITypeParsedOmpData[];
}

export const DataExplorerClient: React.FC<DataExplorerClientProps> = ({ initialData }) => {
  const [tableData, setTableData] = useState<ITypeParsedOmpData[]>([]);
  const dispatch = useDispatch();
  const { selectedDimensions, selectedMetrics, dateRange } = useSelector((state: RootState) => state.dataExplorer);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
  });

  // Functions
  const handleDateRangeChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    // Convert Date objects to ISO strings before dispatching
    dispatch(
      setDateRange({
        startDate: range.startDate?.toISOString() || null,
        endDate: range.endDate?.toISOString() || null,
      })
    );
  };

  const handleFilter = () => {
    const activeFilters = [
      {
        id: "date",
        value: dateRange,
      },
    ];
    table.setColumnFilters(activeFilters);
  };

  const isFilterDisabled = !selectedDimensions.length && (!dateRange.startDate || !dateRange.endDate);

  return (
    <div className="p-2">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Step 1: Select Table</h2>
        <select
          className="border p-2 rounded"
          onChange={(e) => {
            if (e.target.value === "om_proptech") {
              setTableData([...initialData]);
            } else {
              setTableData([]);
            }
          }}
          defaultValue=""
        >
          <option value="">-- Choose an option --</option>
          <option value="om_proptech">OM Proptech Normalized Table</option>
        </select>
      </div>
      <Filters
        onDateRangeChange={handleDateRangeChange}
        onFilter={handleFilter}
        hasData={tableData.length > 0}
        selectedDimensions={selectedDimensions}
        selectedMetrics={selectedMetrics}
        onDimensionsChange={(dims) => dispatch(setSelectedDimensions(dims))}
        onMetricsChange={(metrics) => dispatch(setSelectedMetrics(metrics))}
        isFilterDisabled={isFilterDisabled}
      />
      <Table table={table} />
      <div className="h-4" />
    </div>
  );
};
