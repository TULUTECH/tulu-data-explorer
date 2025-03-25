"use client";
import React from "react";
import { DateRangePicker } from "@/components/client/DateRangePicker";
import { DimensionsAndMetricsPicker, Dimension, Metric } from "@/components/client/DimensionsAndMetricsPicker";

interface FiltersProps {
  onDateRangeChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  onFilter: () => void;
  hasData: boolean;
  selectedDimensions: Dimension[];
  selectedMetrics: Metric[];
  onDimensionsChange: (dimensions: Dimension[]) => void;
  onMetricsChange: (metrics: Metric[]) => void;
  dateRange: { startDate: Date | null; endDate: Date | null };
  isFilterDisabled: boolean;
}

export const Filters: React.FC<FiltersProps> = ({
  onDateRangeChange,
  onFilter,
  hasData,
  selectedDimensions,
  selectedMetrics,
  onDimensionsChange,
  onMetricsChange,
  isFilterDisabled,
}) => {
  if (!hasData) return null;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Step 2: Select Filters</h2>
      <div className="flex items-start gap-8">
        <DateRangePicker onDateRangeChange={onDateRangeChange} />
        <div className="h-full w-px bg-gray-300" />
        <DimensionsAndMetricsPicker
          selectedDimensions={selectedDimensions}
          selectedMetrics={selectedMetrics}
          onDimensionsChange={onDimensionsChange}
          onMetricsChange={onMetricsChange}
        />
        <button
          className="bg-red-400 hover:bg-red-500 text-white px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto text-lg font-medium"
          onClick={onFilter}
          disabled={isFilterDisabled}
        >
          Filter
        </button>
      </div>
    </div>
  );
};
