import { DIMENSION_KEY_ENUM, METRIC_KEY_ENUM } from "@/constants";

export interface ITypeParsedOmpData {
  [DIMENSION_KEY_ENUM.CampaignId]: number | null;
  [DIMENSION_KEY_ENUM.CampaignName]: string | null;
  [DIMENSION_KEY_ENUM.AdGroupId]: number | null;
  [DIMENSION_KEY_ENUM.AdGroupName]: string | null;
  [DIMENSION_KEY_ENUM.Group]: string | null;
  [DIMENSION_KEY_ENUM.Medium]: string | null;
  [DIMENSION_KEY_ENUM.Source]: string | null;
  [DIMENSION_KEY_ENUM.CampaignStatus]: string | null;
  [DIMENSION_KEY_ENUM.AdGroupStatus]: string | null;
  [DIMENSION_KEY_ENUM.Geo]: string | null;
  [DIMENSION_KEY_ENUM.Date]: string | null;
  [METRIC_KEY_ENUM.tulu_cost]: number | null;
  [METRIC_KEY_ENUM.tulu_impressions]: number | null;
  [METRIC_KEY_ENUM.tulu_clicks]: number | null;
  [METRIC_KEY_ENUM.tulu_sessions]: number | null;
  [METRIC_KEY_ENUM.tulu_leads]: number | null;
  [METRIC_KEY_ENUM.tulu_revenue]: number | null;
  [METRIC_KEY_ENUM.tulu_mql]: number | null;
  [METRIC_KEY_ENUM.tulu_clients]: number | null;
}

export interface IDateRange {
  startDate: string | null;
  endDate: string | null;
}

export type DimensionFilterOperator = "equals";

export interface IDimensionValueFilter {
  id: string;
  dimension: DIMENSION_KEY_ENUM | "";
  operator: DimensionFilterOperator;
  value: string;
}

export type DimensionValueMap = Record<DIMENSION_KEY_ENUM, string[]>;

export type MetricTotals = Record<METRIC_KEY_ENUM, number>;
