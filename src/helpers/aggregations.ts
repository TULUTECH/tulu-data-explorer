import { ITypeParsedOmpData } from "@/types/data";
import { METRIC_KEY_ENUM } from "@/constants";

// Groups data based on provided keys
export const groupData = (
  data: ITypeParsedOmpData[],
  groupKeys: (keyof ITypeParsedOmpData)[],
): Map<string, ITypeParsedOmpData[]> => {
  const groups = new Map<string, ITypeParsedOmpData[]>();

  data.forEach((row) => {
    const key = groupKeys
      .map((k) => (row[k] != null ? String(row[k]) : ""))
      .join("|");

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(row);
  });

  return groups;
};

// Aggregates numeric metrics by summing, and picks the first row's values for non-numeric dimensions
export const aggregateGroup = (
  rows: ITypeParsedOmpData[],
): ITypeParsedOmpData => {
  const baseRow = { ...rows[0] };

  const numericMetrics: (keyof ITypeParsedOmpData)[] = [
    METRIC_KEY_ENUM.CostMicros,
    METRIC_KEY_ENUM.Impressions,
    METRIC_KEY_ENUM.Clicks,
    METRIC_KEY_ENUM.Sessions,
    METRIC_KEY_ENUM.Leads,
    METRIC_KEY_ENUM.Revenue,
  ];

  numericMetrics.forEach((metric) => {
    baseRow[metric] = rows.reduce((acc, row) => acc + (row[metric] || 0), 0);
  });

  return baseRow;
};

// Computes custom calculated metrics such as CTR
export const computeCustomMetrics = (
  aggregatedRow: ITypeParsedOmpData,
): ITypeParsedOmpData => {
  const clicks = aggregatedRow.clicks || 0;
  const impressions = aggregatedRow.impressions || 0;

  (aggregatedRow as any)[METRIC_KEY_ENUM.CTR] =
    impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;

  return aggregatedRow;
};

// Combines grouping, aggregating, and calculating custom metrics in one step
export const aggregateDataByKeys = (
  data: ITypeParsedOmpData[],
  groupKeys: (keyof ITypeParsedOmpData)[],
): ITypeParsedOmpData[] => {
  const groupedData = groupData(data, groupKeys);

  const aggregatedResults: ITypeParsedOmpData[] = [];

  groupedData.forEach((rows) => {
    const aggregatedRow = aggregateGroup(rows);
    computeCustomMetrics(aggregatedRow);
    aggregatedResults.push(aggregatedRow);
  });

  return aggregatedResults;
};
