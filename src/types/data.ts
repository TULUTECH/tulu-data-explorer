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

export enum Dimension {
  Date = "date",
  CampaignName = "campaign_name",
  AdGroupId = "ad_group_id",
}

export enum Metric {
  Impressions = "impressions",
  Clicks = "clicks",
  CostMicros = "cost_micros",
  Sessions = "sessions",
  Leads = "leads",
  Revenue = "revenue",
}

const dimensionLabels: Record<Dimension, string> = {
  [Dimension.Date]: "Date",
  [Dimension.CampaignName]: "Campaign (name)",
  [Dimension.AdGroupId]: "Ad Group (id)",
};

export const DIMENSIONS = Object.entries(dimensionLabels).map(([value, label]) => ({
  value: value as Dimension,
  label,
}));

const metricLabels: Record<Metric, string> = {
  [Metric.Impressions]: "Impressions",
  [Metric.Clicks]: "Clicks",
  [Metric.CostMicros]: "Cost (micros)",
  [Metric.Sessions]: "Sessions",
  [Metric.Leads]: "Leads",
  [Metric.Revenue]: "Revenue",
};

export const METRICS = Object.entries(metricLabels).map(([value, label]) => ({ value: value as Metric, label }));
