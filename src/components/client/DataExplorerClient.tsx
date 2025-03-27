"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  GroupingState,
  getSortedRowModel,
  VisibilityState,
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
  const { selectedDimensions, selectedMetrics, dateRange } = useSelector((state: RootState) => state.dataExplorer);
  const [appliedGrouping, setAppliedGrouping] = useState<GroupingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    date: false,
    campaign_name: false,
    campaign_id: false,
    ad_group_name: false,
    ad_group_id: false,
    impressions: false,
    clicks: false,
    cost_micros: false,
    sessions: false,
    leads: false,
    revenue: false,
  });
  const dispatch = useDispatch();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { grouping: appliedGrouping, columnVisibility },
    onGroupingChange: (updatedGrouping) => {
      if (isMountedRef.current) {
        dispatch(setSelectedDimensions(updatedGrouping as Dimension[]));
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
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
    const activeFilters = [{ id: "date", value: dateRange }];
    table.setColumnFilters(activeFilters);

    // Set column visibility based on selected dimensions and metrics
    const visibilityState: VisibilityState = {
      date: selectedDimensions.includes("date"),
      campaign_name: selectedDimensions.includes("campaign_name"),
      campaign_id: selectedDimensions.includes("campaign_name"),
      ad_group_name: selectedDimensions.includes("adgroup_name"),
      ad_group_id: selectedDimensions.includes("adgroup_name"),
      impressions: selectedMetrics.includes("impressions"),
      clicks: selectedMetrics.includes("clicks"),
      cost_micros: selectedMetrics.includes("cost_micros"),
      sessions: selectedMetrics.includes("sessions"),
      leads: selectedMetrics.includes("leads"),
      revenue: selectedMetrics.includes("revenue"),
    };
    setColumnVisibility(visibilityState);
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
              // Reset column visibility when table is selected
              setColumnVisibility({
                date: false,
                campaign_name: false,
                campaign_id: false,
                ad_group_name: false,
                ad_group_id: false,
                impressions: false,
                clicks: false,
                cost_micros: false,
                sessions: false,
                leads: false,
                revenue: false,
              });
            } else {
              setTableData([]);
              setColumnVisibility({
                date: false,
                campaign_name: false,
                campaign_id: false,
                ad_group_name: false,
                ad_group_id: false,
                impressions: false,
                clicks: false,
                cost_micros: false,
                sessions: false,
                leads: false,
                revenue: false,
              });
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
          setColumnVisibility({
            date: false,
            campaign_name: false,
            campaign_id: false,
            ad_group_name: false,
            ad_group_id: false,
            impressions: false,
            clicks: false,
            cost_micros: false,
            sessions: false,
            leads: false,
            revenue: false,
          });
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
