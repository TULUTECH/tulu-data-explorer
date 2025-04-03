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

export enum DIMENSION_DATA_ENUM {
  Date = "date",
  CampaignName = "campaign_name",
  CampaignId = "campaign_id",
  AdGroupName = "ad_group_name",
  AdGroupId = "ad_group_id",
}

export enum METRIC_DATA_ENUM {
  Impressions = "impressions",
  Clicks = "clicks",
  CostMicros = "cost_micros",
  Sessions = "sessions",
  Leads = "leads",
  Revenue = "revenue",
}

export interface IDimensionObj {
  value: DIMENSION_DATA_ENUM;
  label: string;
  isSelectableForTable: boolean;
}

export interface IMetricObj {
  value: METRIC_DATA_ENUM;
  label: string;
  isSelectableForTable: boolean;
}
