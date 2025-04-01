import { Dimension, Metric } from "@/types/data";
import { VisibilityState } from "@tanstack/react-table";

export const DIMENSIONS: { value: Dimension; label: string }[] = [
  { value: Dimension.Date, label: "Date" },
  { value: Dimension.CampaignName, label: "Campaign (name)" },
  { value: Dimension.AdGroupId, label: "Ad Group (id)" },
];

export const METRICS: { value: Metric; label: string }[] = [
  { value: Metric.Impressions, label: "Impressions" },
  { value: Metric.Clicks, label: "Clicks" },
  { value: Metric.CostMicros, label: "Cost (micros)" },
  { value: Metric.Sessions, label: "Sessions" },
  { value: Metric.Leads, label: "Leads" },
  { value: Metric.Revenue, label: "Revenue" },
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
