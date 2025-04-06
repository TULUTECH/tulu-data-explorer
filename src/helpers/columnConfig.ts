import { DIMENSION_LABEL_MAP, METRIC_LABEL_MAP } from "@/constants";
import {
  DIMENSION_DATA_ENUM,
  METRIC_DATA_ENUM,
  ITypeParsedOmpData,
} from "@/types/data";
import { FilterFn, CellContext } from "@tanstack/react-table";
import { format } from "date-fns";

type CellValue = string | number | Date | null;

// Helper Functions
const formatNumberEuropean = (
  props: CellContext<ITypeParsedOmpData, CellValue>,
): React.ReactNode => {
  const value = props.getValue();
  return value != null
    ? Number(value).toLocaleString("de-DE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : "-";
};

const formatCurrency =
  (key: string) =>
  (props: CellContext<ITypeParsedOmpData, CellValue>): React.ReactNode => {
    const value = props.getValue();
    if (value == null) return "-";
    const adjustedValue =
      key === METRIC_DATA_ENUM.CostMicros
        ? Number(value) / 1000000
        : Number(value);
    return adjustedValue.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

const customDateRangeFilter: FilterFn<ITypeParsedOmpData> = (
  row,
  columnId,
  filterValue,
  addMeta,
) => {
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
  if (
    typeof cellValue !== "string" &&
    typeof cellValue !== "number" &&
    !(cellValue instanceof Date)
  ) {
    if (addMeta) addMeta({ filtered: false });
    return false;
  }

  const cellDate =
    cellValue instanceof Date
      ? cellValue
      : new Date(cellValue as string | number);
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

//

type ColumnConfig = {
  key: string;
  header: () => string;
  accessorFn?: (row: ITypeParsedOmpData) => CellValue;
  filterFn?: FilterFn<ITypeParsedOmpData>;
  cell?: (props: CellContext<ITypeParsedOmpData, CellValue>) => React.ReactNode;
};
export const columnConfigs: ColumnConfig[] = [
  {
    key: DIMENSION_DATA_ENUM.CampaignName,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_DATA_ENUM.CampaignName] || "Campaign Name",
  },
  {
    key: "campaign_id",
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_DATA_ENUM.CampaignId] || "Campaign ID",
  },
  {
    key: "ad_group_name",
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_DATA_ENUM.AdGroupName] || "Ad-Group Name",
  },
  {
    key: DIMENSION_DATA_ENUM.AdGroupId,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_DATA_ENUM.AdGroupId] || "Ad-Group ID",
  },
  {
    key: DIMENSION_DATA_ENUM.Date,
    header: () => DIMENSION_LABEL_MAP[DIMENSION_DATA_ENUM.Date] || "Date",
    // Use a custom accessor function to convert date strings to Date objects
    accessorFn: (row) => (row.date ? new Date(row.date) : new Date(0)),
    filterFn: customDateRangeFilter,
    cell: (props) => {
      const dateValue = props.getValue();
      if (
        !(dateValue instanceof Date) ||
        isNaN(dateValue.getTime()) ||
        dateValue.getTime() === 0
      ) {
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
    key: METRIC_DATA_ENUM.CostMicros,
    header: () => METRIC_LABEL_MAP[METRIC_DATA_ENUM.CostMicros] || "Cost",
    cell: formatCurrency(METRIC_DATA_ENUM.CostMicros),
  },
  {
    key: METRIC_DATA_ENUM.Impressions,
    header: () =>
      METRIC_LABEL_MAP[METRIC_DATA_ENUM.Impressions] || "Impressions",
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_DATA_ENUM.Clicks,
    header: () => METRIC_LABEL_MAP[METRIC_DATA_ENUM.Clicks] || "Clicks",
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_DATA_ENUM.Sessions,
    header: () => METRIC_LABEL_MAP[METRIC_DATA_ENUM.Sessions] || "Sessions",
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_DATA_ENUM.Leads,
    header: () => METRIC_LABEL_MAP[METRIC_DATA_ENUM.Leads] || "Leads",
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_DATA_ENUM.Revenue,
    header: () => METRIC_LABEL_MAP[METRIC_DATA_ENUM.Revenue] || "Revenue",
    cell: formatCurrency(METRIC_DATA_ENUM.Revenue),
  },
];

export const columnOrder = [
  DIMENSION_DATA_ENUM.Date,
  "campaign_id",
  DIMENSION_DATA_ENUM.CampaignName,
  DIMENSION_DATA_ENUM.AdGroupId,
  "ad_group_name",
  METRIC_DATA_ENUM.CostMicros,
  METRIC_DATA_ENUM.Impressions,
  METRIC_DATA_ENUM.Clicks,
  METRIC_DATA_ENUM.Sessions,
  METRIC_DATA_ENUM.Leads,
  METRIC_DATA_ENUM.Revenue,
];
