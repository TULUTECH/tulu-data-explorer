import { ITypeParsedOmpData, MetricTotals } from "@/types/data";
import { METRIC_KEY_ENUM } from "@/constants/metricsConfig";

export const AGGREGATABLE_METRICS: METRIC_KEY_ENUM[] = [
  METRIC_KEY_ENUM.tulu_cost,
  METRIC_KEY_ENUM.tulu_impressions,
  METRIC_KEY_ENUM.tulu_clicks,
  METRIC_KEY_ENUM.tulu_sessions,
  METRIC_KEY_ENUM.tulu_leads,
  METRIC_KEY_ENUM.tulu_revenue,
  METRIC_KEY_ENUM.tulu_mql,
  METRIC_KEY_ENUM.tulu_clients,
];

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

  AGGREGATABLE_METRICS.forEach((metric) => {
    baseRow[metric] = rows.reduce((acc, row) => acc + (row[metric] || 0), 0);
  });

  return baseRow;
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
    aggregatedResults.push(aggregatedRow);
  });

  return aggregatedResults;
};

export const createEmptyMetricTotals = (): MetricTotals => {
  return AGGREGATABLE_METRICS.reduce((acc, metric) => {
    acc[metric] = 0;
    return acc;
  }, {} as MetricTotals);
};

export const calculateMetricTotals = (
  data: ITypeParsedOmpData[],
): MetricTotals => {
  const totals = createEmptyMetricTotals();

  data.forEach((row) => {
    AGGREGATABLE_METRICS.forEach((metric) => {
      totals[metric] += row[metric] || 0;
    });
  });

  return totals;
};
