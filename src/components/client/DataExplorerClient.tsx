"use client";
import React, { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  GroupingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Dimension, ITypeParsedOmpData } from "@/types/data";
import { Filters } from "@/components/client/Filters";
import { Table } from "@/components/client/Table";
import { columns } from "@/components/client/Columns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedDimensions } from "@/store/slices/dataExplorerSlice";

interface DataExplorerClientProps {
  initialData: ITypeParsedOmpData[];
}

export const DataExplorerClient: React.FC<DataExplorerClientProps> = ({ initialData }) => {
  const [tableData, setTableData] = useState<ITypeParsedOmpData[]>([]);
  const { selectedDimensions, dateRange } = useSelector((state: RootState) => state.dataExplorer);
  const [appliedGrouping, setAppliedGrouping] = useState<GroupingState>([]);

  const dispatch = useDispatch();

  const table = useReactTable({
    data: tableData,
    columns,
    state: { grouping: appliedGrouping },
    onGroupingChange: (updatedGrouping) => {
      // Update Redux store when grouping changes via user interaction
      dispatch(setSelectedDimensions(updatedGrouping as Dimension[]));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
  });

  const handleFilter = () => {
    setAppliedGrouping(selectedDimensions);

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
      <Filters hasData={tableData.length > 0} />
      <button
        className="bg-red-400 hover:bg-red-500 text-white px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto text-lg font-medium"
        onClick={handleFilter}
        disabled={isFilterDisabled}
      >
        Apply Filters
      </button>
      <button
        className="bg-gray-300 hover:bg-gray-400 text-black px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto text-lg font-medium"
        onClick={() => {
          setAppliedGrouping([]);
          table.resetColumnFilters();
        }}
        disabled={isFilterDisabled}
      >
        Reset
      </button>
      <Table table={table} />
      <div className="h-4" />
    </div>
  );
};
