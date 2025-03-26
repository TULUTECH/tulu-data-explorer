"use client";
import rawDataJson from "@/data/normalized_omp_data.json";
import { ITypeParsedOmpData } from "@/types/data";
import { parseOmpDataTypes } from "@/utils/parseNormalizedOmpData";
import { createColumnHelper, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";

export const omProptechData = parseOmpDataTypes(rawDataJson);

export const columnHelper = createColumnHelper<ITypeParsedOmpData>();

export const customDateRangeFilter: FilterFn<ITypeParsedOmpData> = (row, columnId, filterValue, addMeta) => {
  const { startDate, endDate } = filterValue || {};

  // If no complete range is provided, don't filter out any rows.
  if (!startDate || !endDate) {
    if (addMeta) addMeta({ filtered: false });
    return true;
  }

  const cellValue = row.getValue(columnId);
  if (!cellValue) {
    if (addMeta) addMeta({ filtered: false });
    return false;
  }

  // Only proceed if cellValue is a string, number, or Date
  if (typeof cellValue !== "string" && typeof cellValue !== "number" && !(cellValue instanceof Date)) {
    if (addMeta) addMeta({ filtered: false });
    return false;
  }

  const cellDate = cellValue instanceof Date ? cellValue : new Date(cellValue as string | number);
  if (isNaN(cellDate.getTime())) {
    if (addMeta) addMeta({ filtered: false });
    return false;
  }

  const formatDate = (date: Date): string => format(date, "yyyy-MM-dd");
  const effectiveEndDate = endDate || startDate; // If endDate is missing, treat the filter as a single-date filter

  const cellDateStr = formatDate(cellDate);
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(effectiveEndDate);

  const isInRange = cellDateStr >= startDateStr && cellDateStr <= endDateStr;
  if (addMeta) addMeta({ isInRange });
  return isInRange;
};

export const columns = [
  columnHelper.accessor("campaign_id", {
    header: "Campaign ID",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("campaign_name", {
    header: "Campaign Name",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("ad_group_id", {
    header: "Ad Group ID",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("ad_group_name", {
    header: "Ad Group Name",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => (row.date ? new Date(row.date) : new Date(0)), {
    id: "date",
    header: "Date",
    cell: (props) => {
      const date = props.getValue();
      return date.getTime() === 0
        ? "-"
        : date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
    },
    footer: (props) => props.column.id,
    filterFn: customDateRangeFilter,
  }),
  columnHelper.accessor("cost_micros", {
    header: "Cost (micros)",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("impressions", {
    header: "Impressions",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("clicks", {
    header: "Clicks",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("sessions", {
    header: "Sessions",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("leads", {
    header: "Leads",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("revenue", {
    header: "Revenue",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
];
