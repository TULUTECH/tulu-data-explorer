import { DIMENSION_ENUM, METRIC_ENUM } from "@/types/data";
import { VisibilityState } from "@tanstack/react-table";

export const DIMENSION_OBJS: { value: DIMENSION_ENUM; label: string }[] = [
  { value: DIMENSION_ENUM.Date, label: "Date" },
  { value: DIMENSION_ENUM.CampaignName, label: "Campaign (name)" },
  { value: DIMENSION_ENUM.AdGroupId, label: "Ad Group (id)" },
];

export const METRICS_OBJS: { value: METRIC_ENUM; label: string }[] = [
  { value: METRIC_ENUM.Impressions, label: "Impressions" },
  { value: METRIC_ENUM.Clicks, label: "Clicks" },
  { value: METRIC_ENUM.CostMicros, label: "Cost (micros)" },
  { value: METRIC_ENUM.Sessions, label: "Sessions" },
  { value: METRIC_ENUM.Leads, label: "Leads" },
  { value: METRIC_ENUM.Revenue, label: "Revenue" },
];

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
