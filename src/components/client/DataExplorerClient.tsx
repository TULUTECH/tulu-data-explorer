"use client";
import React, { useEffect, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  GroupingState,
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
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Directly set grouping state from Redux dimensions
    setGrouping(selectedDimensions);
  }, [selectedDimensions]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { grouping },
    onGroupingChange: (updatedGrouping) => {
      // Update Redux store when grouping changes via user interaction
      dispatch(setSelectedDimensions(updatedGrouping as Dimension[]));
    },
    getCoreRowModel: getCoreRowModel(),
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
      <Filters onFilter={handleFilter} hasData={tableData.length > 0} isFilterDisabled={isFilterDisabled} />
      <Table table={table} />
      <div className="h-4" />
    </div>
  );
};
