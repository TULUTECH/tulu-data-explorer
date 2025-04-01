"use client";
import React from "react";
import { DIMENSION_ENUM, METRIC_ENUM } from "@/types/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedDimensions, setSelectedMetrics } from "@/store/slices/dataExplorerSlice";
import { DIMENSION_OBJS, METRICS_OBJS } from "@/constants/dataConfig";

export const DimensionsAndMetricsPicker: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedDimensions, selectedMetrics } = useSelector((state: RootState) => state.dataExplorer);

  const handleDimensionChange = (dimension: DIMENSION_ENUM) => {
    let newDimensions: DIMENSION_ENUM[];

    if (dimension === DIMENSION_ENUM.AdGroupId) {
      // If trying to select ad_group_id, ensure campaign_name is selected
      if (!selectedDimensions.includes(DIMENSION_ENUM.CampaignName)) {
        newDimensions = [...selectedDimensions, DIMENSION_ENUM.CampaignName, DIMENSION_ENUM.AdGroupId];
      } else {
        // If campaign_name is already selected, just toggle ad_group_id
        newDimensions = selectedDimensions.includes(DIMENSION_ENUM.AdGroupId)
          ? selectedDimensions.filter((d) => d !== DIMENSION_ENUM.AdGroupId)
          : [...selectedDimensions, DIMENSION_ENUM.AdGroupId];
      }
    } else if (dimension === DIMENSION_ENUM.CampaignName) {
      // If unchecking campaign_name, also uncheck ad_group_id
      newDimensions = selectedDimensions.includes(DIMENSION_ENUM.CampaignName)
        ? selectedDimensions.filter((d) => d !== DIMENSION_ENUM.CampaignName && d !== DIMENSION_ENUM.AdGroupId)
        : [...selectedDimensions, DIMENSION_ENUM.CampaignName];
    } else {
      // For other dimensions (like date), handle normal toggle
      newDimensions = selectedDimensions.includes(dimension)
        ? selectedDimensions.filter((d) => d !== dimension)
        : [...selectedDimensions, dimension];
    }

    dispatch(setSelectedDimensions(newDimensions));
  };

  const handleMetricChange = (metric: METRIC_ENUM) => {
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
          {DIMENSION_OBJS.map((dimension) => (
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
          {METRICS_OBJS.map((metric) => (
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
