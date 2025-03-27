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
  const [selectedTable, setSelectedTable] = useState<string>("");
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
      grouping: [], // Start with no grouping
    },
  });

  const handleFilter = () => {
    // Set column visibility based on selected dimensions and metrics
    const visibilityState: VisibilityState = {
      date: selectedDimensions.includes("date"),
      campaign_name: selectedDimensions.includes("campaign_name"),
      campaign_id: selectedDimensions.includes("campaign_name"), // Always show campaign_id with campaign_name
      ad_group_name: selectedDimensions.includes("adgroup_name"),
      ad_group_id: selectedDimensions.includes("adgroup_name"), // Always show ad_group_id with ad_group_name
      impressions: selectedMetrics.includes("impressions"),
      clicks: selectedMetrics.includes("clicks"),
      cost_micros: selectedMetrics.includes("cost_micros"),
      sessions: selectedMetrics.includes("sessions"),
      leads: selectedMetrics.includes("leads"),
      revenue: selectedMetrics.includes("revenue"),
    };
    setColumnVisibility(visibilityState);

    // If no dimensions are selected, show no data
    if (selectedDimensions.length === 0) {
      setTableData([]);
      return;
    }

    // Apply date filter
    const activeFilters = [{ id: "date", value: dateRange }];
    table.setColumnFilters(activeFilters);

    // Always start with the initial data when applying filters
    const dataToProcess = [...initialData];

    // If we have date selected, aggregate by date
    if (selectedDimensions.includes("date")) {
      // First, aggregate the data by date
      const aggregatedData = new Map<string, ITypeParsedOmpData>();

      dataToProcess.forEach((row) => {
        // Ensure we have a consistent date string format
        const dateStr = row.date ? new Date(row.date).toISOString().split("T")[0] : null;
        if (!dateStr) return; // Skip rows with null dates

        if (!aggregatedData.has(dateStr)) {
          aggregatedData.set(dateStr, {
            date: dateStr,
            campaign_name: null,
            campaign_id: null,
            ad_group_name: null,
            ad_group_id: null,
            impressions: 0,
            clicks: 0,
            cost_micros: 0,
            sessions: 0,
            leads: 0,
            revenue: 0,
          });
        }
        const aggregatedRow = aggregatedData.get(dateStr)!;
        aggregatedRow.impressions = (aggregatedRow.impressions || 0) + (row.impressions || 0);
        aggregatedRow.clicks = (aggregatedRow.clicks || 0) + (row.clicks || 0);
        aggregatedRow.cost_micros = (aggregatedRow.cost_micros || 0) + (row.cost_micros || 0);
        aggregatedRow.sessions = (aggregatedRow.sessions || 0) + (row.sessions || 0);
        aggregatedRow.leads = (aggregatedRow.leads || 0) + (row.leads || 0);
        aggregatedRow.revenue = (aggregatedRow.revenue || 0) + (row.revenue || 0);
      });

      // If we also have campaign_name selected, create all combinations
      if (selectedDimensions.includes("campaign_name")) {
        const uniqueCampaigns = [...new Set(dataToProcess.map((row) => row.campaign_name))].filter(Boolean);
        const allCombinations: ITypeParsedOmpData[] = [];

        aggregatedData.forEach((dateRow, dateStr) => {
          uniqueCampaigns.forEach((campaignName) => {
            const campaignRows = dataToProcess.filter(
              (row) =>
                row.date &&
                new Date(row.date).toISOString().split("T")[0] === dateStr &&
                row.campaign_name === campaignName
            );

            if (campaignRows.length > 0) {
              const campaignId = campaignRows[0].campaign_id;
              const aggregatedCampaignRow: ITypeParsedOmpData = {
                date: dateStr,
                campaign_name: campaignName,
                campaign_id: campaignId,
                ad_group_name: null,
                ad_group_id: null,
                impressions: campaignRows.reduce((sum, row) => sum + (row.impressions || 0), 0),
                clicks: campaignRows.reduce((sum, row) => sum + (row.clicks || 0), 0),
                cost_micros: campaignRows.reduce((sum, row) => sum + (row.cost_micros || 0), 0),
                sessions: campaignRows.reduce((sum, row) => sum + (row.sessions || 0), 0),
                leads: campaignRows.reduce((sum, row) => sum + (row.leads || 0), 0),
                revenue: campaignRows.reduce((sum, row) => sum + (row.revenue || 0), 0),
              };
              allCombinations.push(aggregatedCampaignRow);
            } else {
              // Create a placeholder row for missing combinations
              const campaignId = dataToProcess.find((row) => row.campaign_name === campaignName)?.campaign_id || null;
              allCombinations.push({
                date: dateStr,
                campaign_name: campaignName,
                campaign_id: campaignId,
                ad_group_name: null,
                ad_group_id: null,
                impressions: 0,
                clicks: 0,
                cost_micros: 0,
                sessions: 0,
                leads: 0,
                revenue: 0,
              });
            }
          });
        });

        // Sort the combinations
        const sortedData = allCombinations.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          if (dateA !== dateB) return dateA - dateB;
          const nameA = a.campaign_name || "";
          const nameB = b.campaign_name || "";
          return nameA.localeCompare(nameB);
        });

        setTableData(sortedData);
      } else {
        // If only date is selected, just use the date-aggregated data
        const sortedData = Array.from(aggregatedData.values()).sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateA - dateB;
        });
        setTableData(sortedData);
      }
    } else if (selectedDimensions.includes("campaign_name")) {
      // If only campaign_name is selected, aggregate by campaign
      const aggregatedData = new Map<string, ITypeParsedOmpData>();

      dataToProcess.forEach((row) => {
        const campaignName = row.campaign_name;
        if (!campaignName) return; // Skip rows with null campaign names

        if (!aggregatedData.has(campaignName)) {
          aggregatedData.set(campaignName, {
            date: null,
            campaign_name: campaignName,
            campaign_id: row.campaign_id,
            ad_group_name: null,
            ad_group_id: null,
            impressions: 0,
            clicks: 0,
            cost_micros: 0,
            sessions: 0,
            leads: 0,
            revenue: 0,
          });
        }
        const aggregatedRow = aggregatedData.get(campaignName)!;
        aggregatedRow.impressions = (aggregatedRow.impressions || 0) + (row.impressions || 0);
        aggregatedRow.clicks = (aggregatedRow.clicks || 0) + (row.clicks || 0);
        aggregatedRow.cost_micros = (aggregatedRow.cost_micros || 0) + (row.cost_micros || 0);
        aggregatedRow.sessions = (aggregatedRow.sessions || 0) + (row.sessions || 0);
        aggregatedRow.leads = (aggregatedRow.leads || 0) + (row.leads || 0);
        aggregatedRow.revenue = (aggregatedRow.revenue || 0) + (row.revenue || 0);
      });

      // Sort by campaign name
      const sortedData = Array.from(aggregatedData.values()).sort((a, b) => {
        const nameA = a.campaign_name || "";
        const nameB = b.campaign_name || "";
        return nameA.localeCompare(nameB);
      });

      setTableData(sortedData);
    } else {
      // If no date is selected but other dimensions are, show all data
      setTableData(dataToProcess);
    }

    // Only apply grouping if we have ad_group_name selected
    if (selectedDimensions.includes("adgroup_name")) {
      const grouping = selectedDimensions.includes("campaign_name")
        ? [...selectedDimensions, "campaign_id"]
        : selectedDimensions;
      setAppliedGrouping(grouping);
    } else {
      setAppliedGrouping([]);
    }
  };

  const isFilterDisabled = !selectedDimensions.length && (!dateRange.startDate || !dateRange.endDate);

  return (
    <div className="p-2">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Step 1: Select Table</h2>
        <select
          className="border p-2 rounded"
          value={selectedTable}
          onChange={(e) => {
            setSelectedTable(e.target.value);
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
