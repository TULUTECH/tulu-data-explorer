export interface CampaignData {
  campaign_id: number | null;
  campaign_name: string | null;
  ad_group_id: number | null;
  ad_group_name: string | null;
  date: Date | null;
  cost_micros: number | null;
  impressions: number | null;
  clicks: number | null;
  sessions: number | null;
  leads: number | null;
  revenue: number | null;
}
