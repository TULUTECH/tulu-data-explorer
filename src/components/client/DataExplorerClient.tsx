"use client";
import React, { useState } from "react";
import { getCoreRowModel, useReactTable, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { ITypeParsedOmpData } from "@/types/data";
import { Filters } from "@/components/client/Filters";
import { Table } from "@/components/client/Table";
import { Dimension, Metric } from "@/components/client/DimensionsAndMetricsPicker";
import { columns } from "@/components/client/Columns";

type ValidDimension = keyof Pick<
  ITypeParsedOmpData,
  "date" | "campaign_id" | "campaign_name" | "ad_group_id" | "ad_group_name"
>;
type ValidMetric = keyof Pick<
  ITypeParsedOmpData,
  "impressions" | "clicks" | "cost_micros" | "sessions" | "leads" | "revenue"
>;

interface DataExplorerClientProps {
  initialData: ITypeParsedOmpData[];
}

export const DataExplorerClient: React.FC<DataExplorerClientProps> = ({ initialData }) => {
  const [tableData, setTableData] = useState<ITypeParsedOmpData[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<ValidDimension[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<ValidMetric[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });

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
    setDateRange(range);
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
        selectedDimensions={selectedDimensions as Dimension[]}
        selectedMetrics={selectedMetrics as Metric[]}
        onDimensionsChange={(dims) => setSelectedDimensions(dims as ValidDimension[])}
        onMetricsChange={(metrics) => setSelectedMetrics(metrics as ValidMetric[])}
        dateRange={dateRange}
        isFilterDisabled={isFilterDisabled}
      />
      <Table table={table} />
      <div className="h-4" />
    </div>
  );
};
