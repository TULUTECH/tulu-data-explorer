"use client";
import React, { useEffect, useRef, useState } from "react";
import { GroupingState, VisibilityState } from "@tanstack/react-table";
import { Dimension, ITypeParsedOmpData, Metric } from "@/types/data";
import { Filters } from "@/components/client/Filters";
import { Table } from "@/components/client/Table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedTable } from "@/store/slices/dataExplorerSlice";
import { useTableConfiguration } from "@/hooks/useTableConfiguration";
import { getVisibilityState } from "@/utils/visibilityState";
import { filterByDateRange } from "@/utils/dataAggregation";
import { processCampaignDimension, processDateDimension } from "@/utils/dataProcessing";
import { FilterButtons } from "./FilterButtons";

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
  const [tableData, setTableData] = useState<ITypeParsedOmpData[]>([]);
  const { selectedDimensions, selectedMetrics, selectedDateRange, selectedTable } = useSelector(
    (state: RootState) => state.dataExplorer
  );
  const [appliedGrouping, setAppliedGrouping] = useState<GroupingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(INITIAL_COLUMN_VISIBILITY);
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
    appliedGrouping,
    columnVisibility,
    dispatch,
    isMountedRef,
    setColumnVisibility,
  });

  const handleReset = () => {
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
  };

  const handleFilter = () => {
    // Prevent filtering if no dimensions are selected
    if (selectedDimensions.length === 0) {
      setTableData([]);
      return;
    }
    setColumnVisibility(getVisibilityState(selectedDimensions as Dimension[], selectedMetrics as Metric[]));

    // Filter and process data
    let processedData = filterByDateRange(initialData, selectedDateRange.startDate, selectedDateRange.endDate);

    // Process data based on selected dimensions
    if (selectedDimensions.includes("date")) {
      processedData = processDateDimension(processedData, selectedDimensions);
    } else if (selectedDimensions.includes("campaign_name")) {
      processedData = processCampaignDimension(processedData);
    }

    // Update table data
    setTableData(processedData);

    // Update grouping state
    updateGrouping();
  };

  const updateGrouping = () => {
    if (selectedDimensions.includes("ad_group_name")) {
      const grouping = selectedDimensions.includes("campaign_name")
        ? [...selectedDimensions, "campaign_id"]
        : selectedDimensions;
      setAppliedGrouping(grouping);
    } else {
      setAppliedGrouping([]);
    }
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
