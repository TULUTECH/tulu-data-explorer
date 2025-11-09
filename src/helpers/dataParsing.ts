import {
  IDimensionValueFilter,
  ITypeParsedOmpData,
  DimensionValueMap,
} from "@/types/data";
import { VisibilityState } from "@tanstack/react-table";
import { DIMENSION_KEY_ENUM, METRIC_KEY_ENUM } from "@/constants";

interface IRawOmpData {
  tulu_campaign_id: string | number | null;
  tulu_campaign_name: string | null;
  tulu_adgroup_id: string | number | null;
  tulu_adgroup_name: string | null;
  tulu_group?: string | null;
  tulu_medium?: string | null;
  tulu_source?: string | null;
  tulu_campaign_status?: string | null;
  tulu_adgroup_status?: string | null;
  tulu_geo?: string | null;
  date: string | null;
  tulu_cost: string | number | null;
  tulu_impressions: string | number | null;
  tulu_clicks: string | number | null;
  tulu_sessions: string | number | null;
  tulu_leads: string | number | null;
  tulu_revenue: string | number | null;
  tulu_mql?: string | number | null;
  tulu_clients?: string | number | null;
}

export const parseOmpDataTypes = (
  rawData: IRawOmpData[],
): ITypeParsedOmpData[] => {
  return rawData.map((item) => ({
    tulu_campaign_id: Number(item.tulu_campaign_id) || null,
    tulu_campaign_name: item.tulu_campaign_name || null,
    tulu_adgroup_id: Number(item.tulu_adgroup_id) || null,
    tulu_adgroup_name: item.tulu_adgroup_name || null,
    tulu_group: item.tulu_group || null,
    tulu_medium: item.tulu_medium || null,
    tulu_source: item.tulu_source || null,
    tulu_campaign_status: item.tulu_campaign_status || null,
    tulu_adgroup_status: item.tulu_adgroup_status || null,
    tulu_geo: item.tulu_geo || null,
    date: item.date || null,
    tulu_cost: Number(item.tulu_cost) || null,
    tulu_impressions: Number(item.tulu_impressions) || null,
    tulu_clicks: Number(item.tulu_clicks) || null,
    tulu_sessions: Number(item.tulu_sessions) || null,
    tulu_leads: Number(item.tulu_leads) || null,
    tulu_revenue: Number(item.tulu_revenue) || null,
    tulu_mql: Number(item.tulu_mql) || null,
    tulu_clients: Number(item.tulu_clients) || null,
  }));
};

export const getVisibilityState = (
  selectedDimensions: DIMENSION_KEY_ENUM[],
  selectedMetrics: METRIC_KEY_ENUM[],
): VisibilityState => ({
  date: selectedDimensions.includes(DIMENSION_KEY_ENUM.Date),
  tulu_campaign_name: selectedDimensions.includes(
    DIMENSION_KEY_ENUM.CampaignName,
  ),
  tulu_campaign_id: selectedDimensions.includes(DIMENSION_KEY_ENUM.CampaignId),
  tulu_adgroup_name: selectedDimensions.includes(
    DIMENSION_KEY_ENUM.AdGroupName,
  ),
  tulu_adgroup_id: selectedDimensions.includes(DIMENSION_KEY_ENUM.AdGroupId),
  tulu_group: selectedDimensions.includes(DIMENSION_KEY_ENUM.Group),
  tulu_medium: selectedDimensions.includes(DIMENSION_KEY_ENUM.Medium),
  tulu_source: selectedDimensions.includes(DIMENSION_KEY_ENUM.Source),
  tulu_campaign_status: selectedDimensions.includes(
    DIMENSION_KEY_ENUM.CampaignStatus,
  ),
  tulu_adgroup_status: selectedDimensions.includes(
    DIMENSION_KEY_ENUM.AdGroupStatus,
  ),
  tulu_geo: selectedDimensions.includes(DIMENSION_KEY_ENUM.Geo),
  tulu_impressions: selectedMetrics.includes(METRIC_KEY_ENUM.tulu_impressions),
  tulu_clicks: selectedMetrics.includes(METRIC_KEY_ENUM.tulu_clicks),
  tulu_cost: selectedMetrics.includes(METRIC_KEY_ENUM.tulu_cost),
  tulu_sessions: selectedMetrics.includes(METRIC_KEY_ENUM.tulu_sessions),
  tulu_leads: selectedMetrics.includes(METRIC_KEY_ENUM.tulu_leads),
  tulu_revenue: selectedMetrics.includes(METRIC_KEY_ENUM.tulu_revenue),
  tulu_mql: selectedMetrics.includes(METRIC_KEY_ENUM.tulu_mql),
  tulu_clients: selectedMetrics.includes(METRIC_KEY_ENUM.tulu_clients),
});

export const filterByDateRange = (
  data: ITypeParsedOmpData[],
  startDate: string | null,
  endDate: string | null,
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

export const filterByDimensionValues = (
  data: ITypeParsedOmpData[],
  filters: IDimensionValueFilter[],
): ITypeParsedOmpData[] => {
  if (!filters.length) {
    return data;
  }

  return data.filter((row) =>
    filters.every((filter) => {
      if (!filter.dimension || filter.value === "") {
        return true;
      }
      const dimensionKey = filter.dimension as DIMENSION_KEY_ENUM;
      const rowValue = row[dimensionKey];
      if (rowValue == null) {
        return false;
      }
      return String(rowValue).toLowerCase() === filter.value.toLowerCase();
    }),
  );
};

export const getDimensionValueMap = (
  data: ITypeParsedOmpData[],
): DimensionValueMap => {
  const map = Object.values(DIMENSION_KEY_ENUM).reduce((acc, key) => {
    acc[key as DIMENSION_KEY_ENUM] = [];
    return acc;
  }, {} as DimensionValueMap);

  data.forEach((row) => {
    Object.keys(map).forEach((dimensionKey) => {
      const typedKey = dimensionKey as DIMENSION_KEY_ENUM;
      const value = row[typedKey];
      if (value == null) return;
      const stringValue = String(value);
      if (!map[typedKey].includes(stringValue)) {
        map[typedKey].push(stringValue);
      }
    });
  });

  Object.keys(map).forEach((dimensionKey) => {
    const typedKey = dimensionKey as DIMENSION_KEY_ENUM;
    map[typedKey].sort((a, b) => a.localeCompare(b));
  });

  return map;
};
