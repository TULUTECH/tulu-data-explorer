import { DIMENSION_KEY_ENUM, METRIC_KEY_ENUM } from "@/constants";

export interface ITypeParsedOmpData {
  [DIMENSION_KEY_ENUM.CampaignId]: number | null;
  [DIMENSION_KEY_ENUM.CampaignName]: string | null;
  [DIMENSION_KEY_ENUM.AdGroupId]: number | null;
  [DIMENSION_KEY_ENUM.AdGroupName]: string | null;
  [DIMENSION_KEY_ENUM.Date]: string | null;
  [METRIC_KEY_ENUM.CostMicros]: number | null;
  [METRIC_KEY_ENUM.Impressions]: number | null;
  [METRIC_KEY_ENUM.Clicks]: number | null;
  [METRIC_KEY_ENUM.Sessions]: number | null;
  [METRIC_KEY_ENUM.Leads]: number | null;
  [METRIC_KEY_ENUM.Revenue]: number | null;
}

export interface IDateRange {
  startDate: string | null;
  endDate: string | null;
}
