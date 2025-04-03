import { DIMENSION_DATA_ENUM, IDimensionObj, IMetricObj, METRIC_DATA_ENUM } from "@/types/data";
import { VisibilityState } from "@tanstack/react-table";

const DIMENSION_CONFIG: Record<DIMENSION_DATA_ENUM, { label: string; isSelectableForTable: boolean }> = {
  [DIMENSION_DATA_ENUM.Date]: { label: "Date", isSelectableForTable: true },
  [DIMENSION_DATA_ENUM.CampaignId]: { label: "Campaign ID", isSelectableForTable: false },
  [DIMENSION_DATA_ENUM.CampaignName]: { label: "Campaign Name", isSelectableForTable: true },
  [DIMENSION_DATA_ENUM.AdGroupId]: { label: "Ad-Group ID", isSelectableForTable: true },
  [DIMENSION_DATA_ENUM.AdGroupName]: { label: "Ad-Group Name", isSelectableForTable: false },
};

export const DIMENSION_OBJS: IDimensionObj[] = Object.values(DIMENSION_DATA_ENUM).map((value) => ({
  value,
  label: DIMENSION_CONFIG[value].label,
  isSelectableForTable: DIMENSION_CONFIG[value].isSelectableForTable,
}));

const METRIC_CONFIG: Record<METRIC_DATA_ENUM, { label: string; isSelectableForTable: boolean }> = {
  [METRIC_DATA_ENUM.Impressions]: { label: "Impressions", isSelectableForTable: true },
  [METRIC_DATA_ENUM.Clicks]: { label: "Clicks", isSelectableForTable: true },
  [METRIC_DATA_ENUM.CostMicros]: { label: "Cost", isSelectableForTable: true },
  [METRIC_DATA_ENUM.Sessions]: { label: "Sessions", isSelectableForTable: true },
  [METRIC_DATA_ENUM.Leads]: { label: "Leads", isSelectableForTable: true },
  [METRIC_DATA_ENUM.Revenue]: { label: "Revenue", isSelectableForTable: true },
};

export const METRIC_OBJS: IMetricObj[] = Object.values(METRIC_DATA_ENUM).map((value) => ({
  value,
  label: METRIC_CONFIG[value].label,
  isSelectableForTable: METRIC_CONFIG[value].isSelectableForTable,
}));

export const INITIAL_COLUMN_VISIBILITY: VisibilityState = {
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
