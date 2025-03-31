"use client";
import React from "react";
import { Dimension, Metric } from "@/types/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedDimensions, setSelectedMetrics } from "@/store/slices/dataExplorerSlice";

export const DimensionsAndMetricsPicker: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedDimensions, selectedMetrics } = useSelector((state: RootState) => state.dataExplorer);

  const dimensions: { value: Dimension; label: string }[] = [
    { value: "date", label: "Date" },
    { value: "campaign_name", label: "Campaign (name)" },
    { value: "ad_group_id", label: "Ad Group (id)" },
  ];

  const metrics: { value: Metric; label: string }[] = [
    { value: "impressions", label: "Impressions" },
    { value: "clicks", label: "Clicks" },
    { value: "cost_micros", label: "Cost (micros)" },
    { value: "sessions", label: "Sessions" },
    { value: "leads", label: "Leads" },
    { value: "revenue", label: "Revenue" },
  ];

  const handleDimensionChange = (dimension: Dimension) => {
    let newDimensions: Dimension[];

    if (dimension === "ad_group_id") {
      // If trying to select ad_group_id, ensure campaign_name is selected
      if (!selectedDimensions.includes("campaign_name")) {
        newDimensions = [...selectedDimensions, "campaign_name", "ad_group_id"];
      } else {
        // If campaign_name is already selected, just toggle ad_group_id
        newDimensions = selectedDimensions.includes("ad_group_id")
          ? selectedDimensions.filter((d) => d !== "ad_group_id")
          : [...selectedDimensions, "ad_group_id"];
      }
    } else if (dimension === "campaign_name") {
      // If unchecking campaign_name, also uncheck ad_group_id
      newDimensions = selectedDimensions.includes("campaign_name")
        ? selectedDimensions.filter((d) => d !== "campaign_name" && d !== "ad_group_id")
        : [...selectedDimensions, "campaign_name"];
    } else {
      // For other dimensions (like date), handle normal toggle
      newDimensions = selectedDimensions.includes(dimension)
        ? selectedDimensions.filter((d) => d !== dimension)
        : [...selectedDimensions, dimension];
    }

    dispatch(setSelectedDimensions(newDimensions));
  };

  const handleMetricChange = (metric: Metric) => {
    const newMetrics = selectedMetrics.includes(metric)
      ? selectedMetrics.filter((m) => m !== metric)
      : [...selectedMetrics, metric];
    dispatch(setSelectedMetrics(newMetrics));
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
