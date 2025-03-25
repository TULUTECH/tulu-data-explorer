"use client";
import React from "react";
import { DateRangePicker } from "./DateRangePicker";

interface FiltersProps {
  onDateRangeChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  onFilter: () => void;
  hasData: boolean;
}

export const Filters: React.FC<FiltersProps> = ({ onDateRangeChange, onFilter, hasData }) => {
  if (!hasData) return null;

  return (
    <div className="flex items-center gap-4 mb-4">
      <DateRangePicker onDateRangeChange={onDateRangeChange} />
      <button
        className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
        onClick={onFilter}
      >
        Filter
      </button>
    </div>
  );
};
