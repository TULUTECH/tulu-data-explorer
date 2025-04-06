"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VisibilityState } from "@tanstack/react-table";
import { DIMENSION_DATA_ENUM, ITypeParsedOmpData } from "@/types/data";
import { Table } from "@/components/client/table/Table";
import { RootState } from "@/store/store";
import {
  resetFilters,
  setSelectedTable,
} from "@/store/slices/dataExplorerSlice";
import { useTableConfiguration } from "@/hooks/useTableConfiguration";
import { getVisibilityState, filterByDateRange } from "@/helpers/dataParsing";
import {
  processAdGroupDimension,
  processCampaignDimension,
  processDateDimension,
} from "@/helpers/dataProcessing";
import { Filters } from "@/components/client/filters/Filters";
import { FilterButtons } from "@/components/client/filters/FilterButtons";
import { INITIAL_COLUMN_VISIBILITY } from "@/constants";

interface DataExplorerClientProps {
  initialData: ITypeParsedOmpData[];
}

export const DataExplorerClient: React.FC<DataExplorerClientProps> = ({
  initialData,
}) => {
  const [tableData, setTableData] = useState<ITypeParsedOmpData[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    INITIAL_COLUMN_VISIBILITY,
  );
  const {
    selectedDimensions,
    selectedMetrics,
    selectedDateRange,
    selectedTable,
  } = useSelector((state: RootState) => state.dataExplorer);
  const dispatch = useDispatch();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  useEffect(() => {}, [selectedTable]);

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

  const getProcessedData = (
    data: ITypeParsedOmpData[],
    dimensions: DIMENSION_DATA_ENUM[],
  ): ITypeParsedOmpData[] => {
    if (dimensions.includes(DIMENSION_DATA_ENUM.Date)) {
      return processDateDimension(data, dimensions);
    }
    if (dimensions.includes(DIMENSION_DATA_ENUM.AdGroupId)) {
      return processAdGroupDimension(data);
    }
    if (dimensions.includes(DIMENSION_DATA_ENUM.CampaignName)) {
      return processCampaignDimension(data);
    }
    return data;
  };

  const handleFilter = () => {
    if (selectedDimensions.length === 0) {
      setTableData([]);
      return;
    }
    setColumnVisibility(
      getVisibilityState(selectedDimensions, selectedMetrics),
    );
    const filteredData = filterByDateRange(
      initialData,
      selectedDateRange.startDate,
      selectedDateRange.endDate,
    );
    const processedData = getProcessedData(filteredData, selectedDimensions);
    setTableData(processedData);
  };

  const isFilterDisabled = selectedDimensions.length === 0;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 rounded-xl shadow-lg w-full max-w-[95vw] 2xl:max-w-[90vw] mx-auto relative">
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 font-sans tracking-normal drop-shadow-sm transform transition-all duration-500 hover:scale-105 hover:drop-shadow-md">
          TULU Data Explorer
        </h1>
        {/* Data status indicator */}
        <div
          className={`flex items-center px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium mt-2 ${
            tableData.length > 0
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-amber-100 text-amber-800 border border-amber-200"
          } transition-all duration-300 shadow-sm`}
        >
          <div
            className={`w-2 md:w-3 h-2 md:h-3 rounded-full mr-2 ${
              tableData.length > 0 ? "bg-green-500" : "bg-amber-500"
            } animate-pulse`}
          ></div>
          {tableData.length > 0
            ? `${tableData.length} records loaded`
            : "No data loaded"}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Step 1: Select Table */}
        <div className="md:w-1/3 bg-white p-4 md:p-6 rounded-lg shadow-md border border-indigo-100 transition-all duration-300 hover:shadow-lg ">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-indigo-700 inline-block transform transition-transform duration-300 hover:scale-105">
            Step 1: Please Select Table
          </h2>
          <select
            className="w-full border border-indigo-300 p-2 md:p-3 rounded-lg bg-white text-gray-700 shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                      transition-all duration-300"
            value={selectedTable}
            onChange={(e) => {
              dispatch(setSelectedTable(e.target.value));
              if (e.target.value === "om_proptech") {
                setTableData([...initialData]);
                setColumnVisibility(INITIAL_COLUMN_VISIBILITY);
              } else {
                handleReset();
              }
            }}
          >
            <option value="">-- Choose an option --</option>
            <option value="om_proptech">OM Proptech Normalized Table</option>
          </select>
        </div>

        {/* Step 2: Select Filters */}
        <div className="md:w-2/3 bg-white p-4 md:p-6 rounded-lg shadow-md border border-indigo-100 transition-all duration-300 hover:shadow-lg ">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-indigo-700 inline-block transform transition-transform duration-300 hover:scale-105">
            Step 2: Please Select Filters
          </h2>
          <div
            className={`transition-opacity duration-500 ${tableData.length > 0 ? "opacity-100" : "opacity-50"}`}
          >
            <Filters hasData={tableData.length > 0} />
          </div>
          <FilterButtons
            isFilterDisabled={isFilterDisabled}
            onFilter={handleFilter}
            onReset={handleReset}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-indigo-100 transition-all duration-300 hover:shadow-lg">
        <div className="p-3 md:p-4">
          <Table table={table} />
        </div>
      </div>
    </div>
  );
};
