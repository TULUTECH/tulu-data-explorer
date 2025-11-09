import {
  DIMENSION_KEY_ENUM,
  DIMENSION_LABEL_MAP,
  METRIC_KEY_ENUM,
  METRIC_LABEL_MAP,
} from "@/constants";
import { ITypeParsedOmpData } from "@/types/data";
import { FilterFn, CellContext, VisibilityState } from "@tanstack/react-table";
import { format } from "date-fns";

type CellValue = string | number | Date | null;

export const INITIAL_COLUMN_VISIBILITY: VisibilityState = {
  date: false,
  tulu_campaign_name: false,
  tulu_campaign_id: false,
  tulu_adgroup_name: false,
  tulu_adgroup_id: false,
  tulu_impressions: false,
  tulu_clicks: false,
  tulu_cost: false,
  tulu_sessions: false,
  tulu_leads: false,
  tulu_revenue: false,
  tulu_source: false,
  tulu_medium: false,
  tulu_campaign_status: false,
  tulu_adgroup_status: false,
  tulu_mql: false,
  tulu_clients: false,
  tulu_geo: false,
  tulu_group: false,
};

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
      key === METRIC_KEY_ENUM.tulu_cost ? Number(value) : Number(value);
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
    key: DIMENSION_KEY_ENUM.CampaignName,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.CampaignName] || "Campaign Name",
  },
  {
    key: DIMENSION_KEY_ENUM.CampaignId,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.CampaignId] || "Campaign ID",
  },
  {
    key: DIMENSION_KEY_ENUM.AdGroupName,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.AdGroupName] || "Ad-Group Name",
  },
  {
    key: DIMENSION_KEY_ENUM.AdGroupId,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.AdGroupId] || "Ad-Group ID",
  },
  {
    key: DIMENSION_KEY_ENUM.Date,
    header: () => DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.Date] || "Date",
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
    key: DIMENSION_KEY_ENUM.Source,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.Source] || "tulu_source",
  },
  {
    key: DIMENSION_KEY_ENUM.Medium,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.Medium] || "tulu_medium",
  },
  {
    key: DIMENSION_KEY_ENUM.CampaignStatus,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.CampaignStatus] ||
      "tulu_campaign_status",
  },
  {
    key: DIMENSION_KEY_ENUM.AdGroupStatus,
    header: () =>
      DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.AdGroupStatus] ||
      "tulu_adgroup_status",
  },
  {
    key: DIMENSION_KEY_ENUM.Group,
    header: () => DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.Group] || "tulu_group",
  },
  {
    key: DIMENSION_KEY_ENUM.Geo,
    header: () => DIMENSION_LABEL_MAP[DIMENSION_KEY_ENUM.Geo] || "tulu_geo",
  },

  {
    key: METRIC_KEY_ENUM.tulu_cost,
    header: () => METRIC_LABEL_MAP[METRIC_KEY_ENUM.tulu_cost] || "Cost",
    cell: formatCurrency(METRIC_KEY_ENUM.tulu_cost),
  },
  {
    key: METRIC_KEY_ENUM.tulu_impressions,
    header: () =>
      METRIC_LABEL_MAP[METRIC_KEY_ENUM.tulu_impressions] || "tulu_impressions",
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_KEY_ENUM.tulu_clicks,
    header: () =>
      METRIC_LABEL_MAP[METRIC_KEY_ENUM.tulu_clicks] || "tulu_clicks",
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_KEY_ENUM.tulu_sessions,
    header: () =>
      METRIC_LABEL_MAP[METRIC_KEY_ENUM.tulu_sessions] || "tulu_sessions",
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_KEY_ENUM.tulu_leads,
    header: () => METRIC_LABEL_MAP[METRIC_KEY_ENUM.tulu_leads] || "tulu_leads",
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_KEY_ENUM.tulu_revenue,
    header: () =>
      METRIC_LABEL_MAP[METRIC_KEY_ENUM.tulu_revenue] || "tulu_revenue",
    cell: formatCurrency(METRIC_KEY_ENUM.tulu_revenue),
  },
  {
    key: METRIC_KEY_ENUM.tulu_mql,
    header: () => METRIC_LABEL_MAP[METRIC_KEY_ENUM.tulu_mql] || "tulu_mql",
    cell: formatNumberEuropean,
  },
  {
    key: METRIC_KEY_ENUM.tulu_clients,
    header: () =>
      METRIC_LABEL_MAP[METRIC_KEY_ENUM.tulu_clients] || "tulu_clients",
    cell: formatNumberEuropean,
  },
];

export const columnOrder = [
  DIMENSION_KEY_ENUM.Date,
  DIMENSION_KEY_ENUM.Geo,
  DIMENSION_KEY_ENUM.CampaignId,
  DIMENSION_KEY_ENUM.CampaignName,
  DIMENSION_KEY_ENUM.AdGroupId,
  DIMENSION_KEY_ENUM.AdGroupName,
  DIMENSION_KEY_ENUM.Source,
  DIMENSION_KEY_ENUM.Medium,
  DIMENSION_KEY_ENUM.CampaignStatus,
  DIMENSION_KEY_ENUM.AdGroupStatus,
  DIMENSION_KEY_ENUM.Group,
  METRIC_KEY_ENUM.tulu_cost,
  METRIC_KEY_ENUM.tulu_impressions,
  METRIC_KEY_ENUM.tulu_clicks,
  METRIC_KEY_ENUM.tulu_sessions,
  METRIC_KEY_ENUM.tulu_leads,
  METRIC_KEY_ENUM.tulu_revenue,
  METRIC_KEY_ENUM.tulu_mql,
  METRIC_KEY_ENUM.tulu_clients,
];
