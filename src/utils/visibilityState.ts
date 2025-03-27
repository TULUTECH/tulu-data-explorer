import { VisibilityState } from "@tanstack/react-table";
import { Dimension, Metric } from "@/types/data";

export const getVisibilityState = (selectedDimensions: Dimension[], selectedMetrics: Metric[]): VisibilityState => ({
  date: selectedDimensions.includes("date"),
  campaign_name: selectedDimensions.includes("campaign_name"),
  campaign_id: selectedDimensions.includes("campaign_name"),
  ad_group_name: selectedDimensions.includes("ad_group_name"),
  ad_group_id: selectedDimensions.includes("ad_group_name"),
  impressions: selectedMetrics.includes("impressions"),
  clicks: selectedMetrics.includes("clicks"),
  cost_micros: selectedMetrics.includes("cost_micros"),
  sessions: selectedMetrics.includes("sessions"),
  leads: selectedMetrics.includes("leads"),
  revenue: selectedMetrics.includes("revenue"),
});
