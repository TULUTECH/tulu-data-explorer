"use client";
import React, { useEffect, useRef, useState } from "react";
import { VisibilityState } from "@tanstack/react-table";
import { Dimension, ITypeParsedOmpData, Metric } from "@/types/data";
import { Table } from "@/components/client/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedDimensions, setSelectedMetrics, setSelectedTable } from "@/store/slices/dataExplorerSlice";
import { useTableConfiguration } from "@/hooks/useTableConfiguration";
import { getVisibilityState } from "@/helpers/helpers";
import { filterByDateRange } from "@/helpers/helpers";
import { processAdGroupDimension, processCampaignDimension, processDateDimension } from "@/helpers/dataProcessing";
import { Filters } from "@/components/client/filters/Filters";
import { FilterButtons } from "@/components/client/filters/FilterButtons";

const INITIAL_COLUMN_VISIBILITY: VisibilityState = {
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
};

interface DataExplorerClientProps {
  initialData: ITypeParsedOmpData[];
}
export const DataExplorerClient: React.FC<DataExplorerClientProps> = ({ initialData }) => {
  // local state
  const [tableData, setTableData] = useState<ITypeParsedOmpData[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(INITIAL_COLUMN_VISIBILITY);
  // redux store
  const { selectedDimensions, selectedMetrics, selectedDateRange, selectedTable } = useSelector(
    (state: RootState) => state.dataExplorer
  );
  const dispatch = useDispatch();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const table = useTableConfiguration({
    tableData,
    columnVisibility,
    dispatch,
    isMountedRef,
    setColumnVisibility,
  });

  const handleReset = () => {
    table.resetColumnFilters();
    setColumnVisibility(INITIAL_COLUMN_VISIBILITY);
    dispatch(setSelectedDimensions([]));
    dispatch(setSelectedMetrics([]));
    dispatch(setSelectedTable(""));
    setTableData([]);
  };

  const handleFilter = () => {
    // Prevent filtering if no dimensions are selected
    if (selectedDimensions.length === 0) {
      setTableData([]);
      return;
    }
    setColumnVisibility(getVisibilityState(selectedDimensions as Dimension[], selectedMetrics as Metric[]));

    // Filter by date range
    let filteredData = filterByDateRange(initialData, selectedDateRange.startDate, selectedDateRange.endDate);

    // Group by dimensions
    if (selectedDimensions.includes("date")) {
      filteredData = processDateDimension(filteredData, selectedDimensions);
    } else if (selectedDimensions.includes("ad_group_id")) {
      filteredData = processAdGroupDimension(filteredData);
    } else if (selectedDimensions.includes("campaign_name")) {
      filteredData = processCampaignDimension(filteredData);
    }

    // Update table data
    setTableData(filteredData);
  };

  const isFilterDisabled = selectedDimensions.length === 0;

  return (
    <div className="p-2">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Step 1: Select Table</h2>
        <select
          className="border p-2 rounded"
          value={selectedTable}
          onChange={(e) => {
            dispatch(setSelectedTable(e.target.value));
            if (e.target.value === "om_proptech") {
              setTableData([...initialData]);
              // Reset column visibility when table is selected
              setColumnVisibility(INITIAL_COLUMN_VISIBILITY);
            } else {
              setTableData([]);
              setColumnVisibility(INITIAL_COLUMN_VISIBILITY);
            }
          }}
        >
          <option value="">-- Choose an option --</option>
          <option value="om_proptech">OM Proptech Normalized Table</option>
        </select>
      </div>
      <Filters hasData={tableData.length > 0} />
      <FilterButtons isFilterDisabled={isFilterDisabled} onFilter={handleFilter} onReset={handleReset} />
      <Table table={table} />
      <div className="h-4" />
    </div>
  );
};
