"use client";
import React, { useState } from "react";
import { DateRangePicker } from "@/components/client/DateRangePicker";
import { DimensionsAndMetricsPicker, Dimension, Metric } from "@/components/client/DimensionsAndMetricsPicker";

interface FiltersProps {
  onDateRangeChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  onFilter: (filters: {
    dateRange: { startDate: Date | null; endDate: Date | null };
    dimensions: Dimension[];
    metrics: Metric[];
  }) => void;
  hasData: boolean;
}

export const Filters: React.FC<FiltersProps> = ({ onDateRangeChange, onFilter, hasData }) => {
  const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });

  if (!hasData) return null;

  const handleDateRangeChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
    onDateRangeChange(range);
  };

  const handleFilter = () => {
    onFilter({
      dateRange,
      dimensions: selectedDimensions,
      metrics: selectedMetrics,
    });
  };

  const isFilterDisabled = !selectedDimensions.length && (!dateRange.startDate || !dateRange.endDate);

  return (
    <div className="flex flex-col gap-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Step 2: Select Filters</h2>
      <div className="flex items-start gap-8">
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        <div className="h-full w-px bg-gray-300" />
        <DimensionsAndMetricsPicker
          selectedDimensions={selectedDimensions}
          selectedMetrics={selectedMetrics}
          onDimensionsChange={setSelectedDimensions}
          onMetricsChange={setSelectedMetrics}
        />
        <button
          className="bg-red-400 hover:bg-red-500 text-white px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto text-lg font-medium"
          onClick={handleFilter}
          disabled={isFilterDisabled}
        >
          Filter
        </button>
      </div>
    </div>
  );
};
