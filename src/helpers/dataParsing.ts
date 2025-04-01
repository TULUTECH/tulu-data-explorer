import { ITypeParsedOmpData } from "@/types/data";
import { VisibilityState } from "@tanstack/react-table";
import { Dimension, Metric } from "@/types/data";

interface IRawOmpData {
  campaign_id: string;
  campaign_name: string;
  ad_group_id: string;
  ad_group_name: string;
  date: string;
  cost_micros: string;
  impressions: string;
  clicks: string;
  sessions: string;
  leads: string;
  revenue: string | number;
}

export const parseOmpDataTypes = (rawData: IRawOmpData[]): ITypeParsedOmpData[] => {
  return rawData.map((item) => ({
    campaign_id: Number(item.campaign_id) || null,
    campaign_name: item.campaign_name || null,
    ad_group_id: Number(item.ad_group_id) || null,
    ad_group_name: item.ad_group_name || null,
    date: item.date || null,
    cost_micros: Number(item.cost_micros) || null,
    impressions: Number(item.impressions) || null,
    clicks: Number(item.clicks) || null,
    sessions: Number(item.sessions) || null,
    leads: Number(item.leads) || null,
    revenue: Number(item.revenue) || null,
  }));
};

export const getVisibilityState = (selectedDimensions: Dimension[], selectedMetrics: Metric[]): VisibilityState => ({
  date: selectedDimensions.includes(Dimension.Date),
  campaign_name: selectedDimensions.includes(Dimension.CampaignName),
  campaign_id: selectedDimensions.includes(Dimension.CampaignName),
  ad_group_name: selectedDimensions.includes(Dimension.AdGroupId),
  ad_group_id: selectedDimensions.includes(Dimension.AdGroupId),
  impressions: selectedMetrics.includes(Metric.Impressions),
  clicks: selectedMetrics.includes(Metric.Clicks),
  cost_micros: selectedMetrics.includes(Metric.CostMicros),
  sessions: selectedMetrics.includes(Metric.Sessions),
  leads: selectedMetrics.includes(Metric.Leads),
  revenue: selectedMetrics.includes(Metric.Revenue),
});

export const filterByDateRange = (
  data: ITypeParsedOmpData[],
  startDate: string | null,
  endDate: string | null
): ITypeParsedOmpData[] => {
  if (!startDate || !endDate) return data;

  const startDateStr = startDate.split("T")[0];
  const endDateStr = endDate.split("T")[0];

  return data.filter((row) => {
    if (!row.date) return false;
    const rowDateStr = new Date(row.date).toISOString().split("T")[0];
    return rowDateStr >= startDateStr && rowDateStr <= endDateStr;
  });
};
