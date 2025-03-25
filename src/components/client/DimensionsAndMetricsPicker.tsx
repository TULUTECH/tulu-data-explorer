"use client";
import React from "react";

export type Dimension = "date" | "campaign_name" | "adgroup_name";
export type Metric = "impressions" | "clicks" | "cost" | "sessions" | "leads" | "revenue";

interface DimensionsAndMetricsPickerProps {
  selectedDimensions: Dimension[];
  selectedMetrics: Metric[];
  onDimensionsChange: (dimensions: Dimension[]) => void;
  onMetricsChange: (metrics: Metric[]) => void;
}

export const DimensionsAndMetricsPicker: React.FC<DimensionsAndMetricsPickerProps> = ({
  selectedDimensions,
  selectedMetrics,
  onDimensionsChange,
  onMetricsChange,
}) => {
  const dimensions: { value: Dimension; label: string }[] = [
    { value: "date", label: "Date" },
    { value: "campaign_name", label: "Campaign Name" },
    { value: "adgroup_name", label: "Ad Group Name" },
  ];

  const metrics: { value: Metric; label: string }[] = [
    { value: "impressions", label: "Impressions" },
    { value: "clicks", label: "Clicks" },
    { value: "cost", label: "Cost" },
    { value: "sessions", label: "Sessions" },
    { value: "leads", label: "Leads" },
    { value: "revenue", label: "Revenue" },
  ];

  const handleDimensionChange = (dimension: Dimension) => {
    let newDimensions: Dimension[];

    if (dimension === "adgroup_name") {
      // If trying to select adgroup_name, ensure campaign_name is selected
      if (!selectedDimensions.includes("campaign_name")) {
        newDimensions = [...selectedDimensions, "campaign_name", "adgroup_name"];
      } else {
        // If campaign_name is already selected, just toggle adgroup_name
        newDimensions = selectedDimensions.includes("adgroup_name")
          ? selectedDimensions.filter((d) => d !== "adgroup_name")
          : [...selectedDimensions, "adgroup_name"];
      }
    } else if (dimension === "campaign_name") {
      // If unchecking campaign_name, also uncheck adgroup_name
      newDimensions = selectedDimensions.includes("campaign_name")
        ? selectedDimensions.filter((d) => d !== "campaign_name" && d !== "adgroup_name")
        : [...selectedDimensions, "campaign_name"];
    } else {
      // For other dimensions (like date), handle normal toggle
      newDimensions = selectedDimensions.includes(dimension)
        ? selectedDimensions.filter((d) => d !== dimension)
        : [...selectedDimensions, dimension];
    }

    onDimensionsChange(newDimensions);
  };

  const handleMetricChange = (metric: Metric) => {
    const newMetrics = selectedMetrics.includes(metric)
      ? selectedMetrics.filter((m) => m !== metric)
      : [...selectedMetrics, metric];
    onMetricsChange(newMetrics);
  };

  const isMetricsDisabled = selectedDimensions.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-medium text-gray-700 mb-2">Dimensions</h3>
        <div className="flex flex-wrap gap-4">
          {dimensions.map((dimension) => (
            <label key={dimension.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedDimensions.includes(dimension.value)}
                onChange={() => handleDimensionChange(dimension.value)}
                className="rounded border-gray-300"
              />
              {dimension.label}
            </label>
          ))}
        </div>
      </div>
      <div className={`${isMetricsDisabled ? "opacity-50" : ""}`}>
        <h3 className="font-medium text-gray-700 mb-2">Metrics</h3>
        <div className="flex flex-wrap gap-4">
          {metrics.map((metric) => (
            <label key={metric.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric.value)}
                onChange={() => handleMetricChange(metric.value)}
                disabled={isMetricsDisabled}
                className="rounded border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className={isMetricsDisabled ? "text-gray-500" : ""}>{metric.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
