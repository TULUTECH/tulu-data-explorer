import { METRICS_OBJS } from "@/constants";
import { DIMENSION_ENUM, METRIC_ENUM, DIMENSION_OBJS, ITypeParsedOmpData } from "@/types/data";
import { FilterFn, CellContext } from "@tanstack/react-table";
import { format } from "date-fns";

type ColumnConfig = {
  key: string;
  header: () => string;
  accessorFn?: (row: ITypeParsedOmpData) => any;
  filterFn?: FilterFn<ITypeParsedOmpData>;
  cell?: (props: CellContext<ITypeParsedOmpData, any>) => React.ReactNode;
};

const createHeaderFromLabel = <T extends string>(
  value: T,
  arrayOfDimensionsOrMetrics: { value: T; label: string }[],
  fallbackLabel: string
): (() => string) => {
  return () => arrayOfDimensionsOrMetrics.find((item) => item.value === value)?.label || fallbackLabel;
};

// Reusable function to format numbers in European style (with period as thousand separator)
const formatNumberEuropean = (props: CellContext<ITypeParsedOmpData, any>): React.ReactNode => {
  const value = props.getValue();
  return value != null
    ? Number(value).toLocaleString("de-DE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : "-";
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
    key: DIMENSION_ENUM.CampaignName,
    header: createHeaderFromLabel(DIMENSION_ENUM.CampaignName, DIMENSION_OBJS, "Campaign Name"),
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
    key: DIMENSION_ENUM.AdGroupId,
    header: createHeaderFromLabel(DIMENSION_ENUM.AdGroupId, DIMENSION_OBJS, "Ad Group ID"),
  },
  {
    key: DIMENSION_ENUM.Date,
    header: createHeaderFromLabel(DIMENSION_ENUM.Date, DIMENSION_OBJS, "Date"),
    // Use a custom accessor function to convert date strings to Date objects
    accessorFn: (row) => (row.date ? new Date(row.date) : new Date(0)),
    filterFn: customDateRangeFilter,
    cell: (props) => {
      const dateValue = props.getValue();
      if (!(dateValue instanceof Date) || isNaN(dateValue.getTime()) || dateValue.getTime() === 0) {
        return "-";
      }
      return dateValue.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    key: METRIC_ENUM.CostMicros,
    header: createHeaderFromLabel(METRIC_ENUM.CostMicros, METRICS_OBJS, "Cost (micros)"),
    cell: (props) => {
      const value = props.getValue();
      return value != null
        ? (Number(value) / 1000000).toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "-";
    },
  },
  {
    key: METRIC_ENUM.Impressions,
    header: createHeaderFromLabel(METRIC_ENUM.Impressions, METRICS_OBJS, "Impressions"),
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_ENUM.Clicks,
    header: createHeaderFromLabel(METRIC_ENUM.Clicks, METRICS_OBJS, "Clicks"),
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_ENUM.Sessions,
    header: createHeaderFromLabel(METRIC_ENUM.Sessions, METRICS_OBJS, "Sessions"),
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_ENUM.Leads,
    header: createHeaderFromLabel(METRIC_ENUM.Leads, METRICS_OBJS, "Leads"),
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_ENUM.Revenue,
    header: createHeaderFromLabel(METRIC_ENUM.Revenue, METRICS_OBJS, "Revenue"),
    cell: (props) => {
      const value = props.getValue();
      return value != null
        ? Number(value).toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "-";
    },
  },
];

export const columnOrder = [
  DIMENSION_ENUM.Date,
  "campaign_id",
  DIMENSION_ENUM.CampaignName,
  DIMENSION_ENUM.AdGroupId,
  "ad_group_name",
  METRIC_ENUM.CostMicros,
  METRIC_ENUM.Impressions,
  METRIC_ENUM.Clicks,
  METRIC_ENUM.Sessions,
  METRIC_ENUM.Leads,
  METRIC_ENUM.Revenue,
];
