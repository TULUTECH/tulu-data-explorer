import { MetricTotals } from "@/types/data";
import { METRIC_KEY_ENUM, METRIC_LABEL_MAP } from "@/constants/metricsConfig";

const safeDivide = (numerator: number, denominator: number): number =>
  denominator ? numerator / denominator : 0;

export type CalculationFormat = "number" | "currency" | "percentage";

export type DerivedCalculationKey =
  | "ctr"
  | "cpc"
  | "cpl"
  | "cpm"
  | "roas"
  | "profit";

export type CalculationKey = METRIC_KEY_ENUM | DerivedCalculationKey;

export interface CalculationDefinition {
  key: CalculationKey;
  label: string;
  description: string;
  format: CalculationFormat;
  calculate: (totals: MetricTotals) => number;
}

const currencyMetrics = new Set<METRIC_KEY_ENUM>([
  METRIC_KEY_ENUM.tulu_cost,
  METRIC_KEY_ENUM.tulu_revenue,
]);

const metricDefinitions: CalculationDefinition[] = Object.values(
  METRIC_KEY_ENUM,
).map((metric) => ({
  key: metric,
  label: `Total ${METRIC_LABEL_MAP[metric] ?? metric}`,
  description: `Sum of ${METRIC_LABEL_MAP[metric] ?? metric} for the filtered data.`,
  format: currencyMetrics.has(metric) ? "currency" : "number",
  calculate: (totals: MetricTotals) => totals[metric] ?? 0,
}));

const derivedDefinitions: CalculationDefinition[] = [
  {
    key: "ctr",
    label: "CTR %",
    description: "Click-through rate (clicks / impressions).",
    format: "percentage",
    calculate: (totals) =>
      safeDivide(
        totals[METRIC_KEY_ENUM.tulu_clicks],
        totals[METRIC_KEY_ENUM.tulu_impressions],
      ) * 100,
  },
  {
    key: "cpc",
    label: "CPC",
    description: "Cost per click (cost / clicks).",
    format: "currency",
    calculate: (totals) =>
      safeDivide(
        totals[METRIC_KEY_ENUM.tulu_cost],
        totals[METRIC_KEY_ENUM.tulu_clicks],
      ),
  },
  {
    key: "cpl",
    label: "CPL",
    description: "Cost per lead (cost / leads).",
    format: "currency",
    calculate: (totals) =>
      safeDivide(
        totals[METRIC_KEY_ENUM.tulu_cost],
        totals[METRIC_KEY_ENUM.tulu_leads],
      ),
  },
  {
    key: "cpm",
    label: "CPM",
    description: "Cost per 1K impressions.",
    format: "currency",
    calculate: (totals) =>
      safeDivide(
        totals[METRIC_KEY_ENUM.tulu_cost],
        totals[METRIC_KEY_ENUM.tulu_impressions],
      ) * 1000,
  },
  {
    key: "roas",
    label: "ROAS",
    description: "Return on ad spend (revenue / cost).",
    format: "number",
    calculate: (totals) =>
      safeDivide(
        totals[METRIC_KEY_ENUM.tulu_revenue],
        totals[METRIC_KEY_ENUM.tulu_cost],
      ),
  },
  {
    key: "profit",
    label: "Profit",
    description: "Revenue minus cost.",
    format: "currency",
    calculate: (totals) =>
      (totals[METRIC_KEY_ENUM.tulu_revenue] || 0) -
      (totals[METRIC_KEY_ENUM.tulu_cost] || 0),
  },
];

export const CALCULATION_DEFINITIONS: Record<
  CalculationKey,
  CalculationDefinition
> = [...metricDefinitions, ...derivedDefinitions].reduce(
  (acc, definition) => {
    acc[definition.key] = definition;
    return acc;
  },
  {} as Record<CalculationKey, CalculationDefinition>,
);

export const CALCULATION_OPTIONS = Object.values(CALCULATION_DEFINITIONS).map(
  (definition) => ({
    value: definition.key,
    label: definition.label,
    description: definition.description,
  }),
);

export const DEFAULT_CALCULATION_KEYS: CalculationKey[] = [
  METRIC_KEY_ENUM.tulu_cost,
  METRIC_KEY_ENUM.tulu_revenue,
  METRIC_KEY_ENUM.tulu_impressions,
  METRIC_KEY_ENUM.tulu_clicks,
  "ctr",
];
