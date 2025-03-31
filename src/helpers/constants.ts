import { Dimension, Metric } from "@/types/data";

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
