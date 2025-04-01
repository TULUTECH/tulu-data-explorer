import { METRICS } from "@/constants";
import { Dimension, Metric, DIMENSIONS, ITypeParsedOmpData } from "@/types/data";
import { FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";

type ColumnConfig = {
  key: string;
  header: () => string;
  accessorFn?: (row: ITypeParsedOmpData) => any;
  filterFn?: FilterFn<ITypeParsedOmpData>;
};

const createHeaderFromLabel = <T extends string>(
  value: T,
  arrayOfDimensionsOrMetrics: { value: T; label: string }[],
  fallbackLabel: string
): (() => string) => {
  return () => arrayOfDimensionsOrMetrics.find((item) => item.value === value)?.label || fallbackLabel;
};

const customDateRangeFilter: FilterFn<ITypeParsedOmpData> = (row, columnId, filterValue, addMeta) => {
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

export const columnConfigs: ColumnConfig[] = [
  {
    key: Dimension.CampaignName,
    header: createHeaderFromLabel(Dimension.CampaignName, DIMENSIONS, "Campaign Name"),
  },
  {
    key: "campaign_id",
    header: () => "Campaign ID",
  },
  {
    key: "ad_group_name",
    header: () => "Ad Group Name",
  },
  {
    key: Dimension.AdGroupId,
    header: createHeaderFromLabel(Dimension.AdGroupId, DIMENSIONS, "Ad Group ID"),
  },
  {
    key: Dimension.Date,
    header: createHeaderFromLabel(Dimension.Date, DIMENSIONS, "Date"),
    // Use a custom accessor function to convert date strings to Date objects
    accessorFn: (row) => (row.date ? new Date(row.date) : new Date(0)),
    filterFn: customDateRangeFilter,
  },
  {
    key: Metric.CostMicros,
    header: createHeaderFromLabel(Metric.CostMicros, METRICS, "Cost (micros)"),
  },
  {
    key: Metric.Impressions,
    header: createHeaderFromLabel(Metric.Impressions, METRICS, "Impressions"),
  },
  {
    key: Metric.Clicks,
    header: createHeaderFromLabel(Metric.Clicks, METRICS, "Clicks"),
  },
  {
    key: Metric.Sessions,
    header: createHeaderFromLabel(Metric.Sessions, METRICS, "Sessions"),
  },
  {
    key: Metric.Leads,
    header: createHeaderFromLabel(Metric.Leads, METRICS, "Leads"),
  },
  {
    key: Metric.Revenue,
    header: createHeaderFromLabel(Metric.Revenue, METRICS, "Revenue"),
  },
];

export const columnOrder = [
  Dimension.Date,
  "campaign_id",
  Dimension.CampaignName,
  Dimension.AdGroupId,
  "ad_group_name",
  Metric.CostMicros,
  Metric.Impressions,
  Metric.Clicks,
  Metric.Sessions,
  Metric.Leads,
  Metric.Revenue,
];
