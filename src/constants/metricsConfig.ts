export enum METRIC_KEY_ENUM {
  Impressions = "impressions",
  Clicks = "clicks",
  CostMicros = "cost_micros",
  Sessions = "sessions",
  Leads = "leads",
  Revenue = "revenue",
}

export interface IMetricConfig {
  label: string;
}

export const METRIC_CONFIG: Record<METRIC_KEY_ENUM, IMetricConfig> = {
  [METRIC_KEY_ENUM.Impressions]: { label: "Impressions" },
  [METRIC_KEY_ENUM.Clicks]: { label: "Clicks" },
  [METRIC_KEY_ENUM.CostMicros]: { label: "Cost" },
  [METRIC_KEY_ENUM.Sessions]: { label: "Sessions" },
  [METRIC_KEY_ENUM.Leads]: { label: "Leads" },
  [METRIC_KEY_ENUM.Revenue]: { label: "Revenue" },
};

export const METRIC_OBJS = Object.entries(METRIC_CONFIG).map(
  ([key, config]) => ({
    value: key as METRIC_KEY_ENUM,
    label: config.label,
  }),
);

export const METRIC_LABEL_MAP = Object.keys(METRIC_CONFIG).reduce(
  (acc, key) => {
    const typedKey = key as METRIC_KEY_ENUM;
    acc[typedKey] = METRIC_CONFIG[typedKey].label;
    return acc;
  },
  {} as Record<METRIC_KEY_ENUM, string>,
);
