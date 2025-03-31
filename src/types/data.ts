export interface ITypeParsedOmpData {
  campaign_id: number | null;
  campaign_name: string | null;
  ad_group_id: number | null;
  ad_group_name: string | null;
  date: string | null;
  cost_micros: number | null;
  impressions: number | null;
  clicks: number | null;
  sessions: number | null;
  leads: number | null;
  revenue: number | null;
}

export interface IDateRange {
  startDate: string | null;
  endDate: string | null;
}

export type Dimension = "date" | "campaign_name" | "ad_group_id";
export type Metric = "impressions" | "clicks" | "cost_micros" | "sessions" | "leads" | "revenue";
