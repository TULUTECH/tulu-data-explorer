"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VisibilityState } from "@tanstack/react-table";
import { Dimension, ITypeParsedOmpData, Metric } from "@/types/data";
import { Table } from "@/components/client/table/Table";
import { RootState } from "@/store/store";
import { resetFilters, setSelectedTable } from "@/store/slices/dataExplorerSlice";
import { useTableConfiguration } from "@/hooks/useTableConfiguration";
import { getVisibilityState, filterByDateRange } from "@/helpers/helpers";
import { processAdGroupDimension, processCampaignDimension, processDateDimension } from "@/helpers/dataProcessing";
import { Filters } from "@/components/client/filters/Filters";
import { FilterButtons } from "@/components/client/filters/FilterButtons";
import { INITIAL_COLUMN_VISIBILITY } from "@/helpers/constants";

interface DataExplorerClientProps {
  initialData: ITypeParsedOmpData[];
}
export const DataExplorerClient: React.FC<DataExplorerClientProps> = ({ initialData }) => {
  const [tableData, setTableData] = useState<ITypeParsedOmpData[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(INITIAL_COLUMN_VISIBILITY);
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
    setColumnVisibility(INITIAL_COLUMN_VISIBILITY);
    dispatch(resetFilters());
    setTableData([]);
  };

  const getProcessedData = (data: ITypeParsedOmpData[], dimensions: Dimension[]): ITypeParsedOmpData[] => {
    if (dimensions.includes("date")) {
      return processDateDimension(data, dimensions);
    }
    if (dimensions.includes("ad_group_id")) {
      return processAdGroupDimension(data);
    }
    if (dimensions.includes("campaign_name")) {
      return processCampaignDimension(data);
    }
    return data;
  };

  const handleFilter = () => {
    if (selectedDimensions.length === 0) {
      setTableData([]);
      return;
    }
    setColumnVisibility(getVisibilityState(selectedDimensions, selectedMetrics));
    const filteredData = filterByDateRange(initialData, selectedDateRange.startDate, selectedDateRange.endDate);
    const processedData = getProcessedData(filteredData, selectedDimensions);
    setTableData(processedData);
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
