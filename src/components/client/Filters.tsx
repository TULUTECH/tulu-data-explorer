"use client";
import React from "react";
import { DateRangePicker } from "@/components/client/DateRangePicker";
import { DimensionsAndMetricsPicker } from "@/components/client/DimensionsAndMetricsPicker";

interface FiltersProps {
  onFilter: () => void;
  hasData: boolean;
  isFilterDisabled: boolean;
}

export const Filters: React.FC<FiltersProps> = ({ onFilter, hasData, isFilterDisabled }) => {
  if (!hasData) return null;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Step 2: Select Filters</h2>
      <div className="flex items-start gap-8">
        <DateRangePicker />
        <div className="h-full w-px bg-gray-300" />
        <DimensionsAndMetricsPicker />
        <button
          className="bg-red-400 hover:bg-red-500 text-white px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto text-lg font-medium"
          onClick={onFilter}
          disabled={isFilterDisabled}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
