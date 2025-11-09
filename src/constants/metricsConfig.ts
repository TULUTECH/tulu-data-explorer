export enum METRIC_KEY_ENUM {
  tulu_impressions = "tulu_impressions",
  tulu_clicks = "tulu_clicks",
  tulu_cost = "tulu_cost",
  tulu_sessions = "tulu_sessions",
  tulu_leads = "tulu_leads",
  tulu_revenue = "tulu_revenue",
  tulu_mql = "tulu_mql",
  tulu_clients = "tulu_clients",
}

export interface IMetricConfig {
  label: string;
}

export const METRIC_CONFIG: Record<METRIC_KEY_ENUM, IMetricConfig> = {
  [METRIC_KEY_ENUM.tulu_impressions]: { label: "tulu_impressions" },
  [METRIC_KEY_ENUM.tulu_clicks]: { label: "tulu_clicks" },
  [METRIC_KEY_ENUM.tulu_cost]: { label: "tulu_cost" },
  [METRIC_KEY_ENUM.tulu_sessions]: { label: "tulu_sessions" },
  [METRIC_KEY_ENUM.tulu_leads]: { label: "tulu_leads" },
  [METRIC_KEY_ENUM.tulu_revenue]: { label: "tulu_revenue" },
  [METRIC_KEY_ENUM.tulu_mql]: { label: "tulu_mql" },
  [METRIC_KEY_ENUM.tulu_clients]: { label: "tulu_clients" },
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
