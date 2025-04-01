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

export enum DIMENSION_ENUM {
  Date = "date",
  CampaignName = "campaign_name",
  AdGroupId = "ad_group_id",
}

export enum METRIC_ENUM {
  Impressions = "impressions",
  Clicks = "clicks",
  CostMicros = "cost_micros",
  Sessions = "sessions",
  Leads = "leads",
  Revenue = "revenue",
}

const dimensionLabels: Record<DIMENSION_ENUM, string> = {
  [DIMENSION_ENUM.Date]: "Date",
  [DIMENSION_ENUM.CampaignName]: "Campaign (name)",
  [DIMENSION_ENUM.AdGroupId]: "Ad Group (id)",
};

export const DIMENSION_OBJS = Object.entries(dimensionLabels).map(([value, label]) => ({
  value: value as DIMENSION_ENUM,
  label,
}));

const metricLabels: Record<METRIC_ENUM, string> = {
  [METRIC_ENUM.Impressions]: "Impressions",
  [METRIC_ENUM.Clicks]: "Clicks",
  [METRIC_ENUM.CostMicros]: "Cost (micros)",
  [METRIC_ENUM.Sessions]: "Sessions",
  [METRIC_ENUM.Leads]: "Leads",
  [METRIC_ENUM.Revenue]: "Revenue",
};

export const METRICS_OBJS = Object.entries(metricLabels).map(([value, label]) => ({
  value: value as METRIC_ENUM,
  label,
}));
