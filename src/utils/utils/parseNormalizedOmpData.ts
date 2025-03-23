import { ITypeParsedOmpData } from "@/types/data";

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
    date: item.date ? new Date(item.date) : null,
    cost_micros: Number(item.cost_micros) || null,
    impressions: Number(item.impressions) || null,
    clicks: Number(item.clicks) || null,
    sessions: Number(item.sessions) || null,
    leads: Number(item.leads) || null,
    revenue: Number(item.revenue) || null,
  }));
};
