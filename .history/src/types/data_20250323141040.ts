export interface INormalizedOmpData {
  campaign_id: number;
  campaign_name: string;
  ad_group_id: number;
  ad_group_name: string;
  date: Date;
  cost_micros: number;
  impressions: number;
  clicks: number;
  sessions: number;
  leads: number;
  revenue: number;
}
