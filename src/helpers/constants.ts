import { Dimension, Metric } from "@/types/data";
import { VisibilityState } from "@tanstack/react-table";

export const DIMENSIONS: { value: Dimension; label: string }[] = [
  { value: "date", label: "Date" },
  { value: "campaign_name", label: "Campaign (name)" },
  { value: "ad_group_id", label: "Ad Group (id)" },
];

export const METRICS: { value: Metric; label: string }[] = [
  { value: "impressions", label: "Impressions" },
  { value: "clicks", label: "Clicks" },
  { value: "cost_micros", label: "Cost (micros)" },
  { value: "sessions", label: "Sessions" },
  { value: "leads", label: "Leads" },
  { value: "revenue", label: "Revenue" },
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