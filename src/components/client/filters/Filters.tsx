"use client";
import React from "react";
import { DateRangePicker } from "@/components/client/filters/DateRangePicker";
import { DimensionsAndMetricsPicker } from "@/components/client/filters/DimensionsAndMetricsPicker";

interface FiltersProps {
  hasData: boolean;
}

export const Filters: React.FC<FiltersProps> = ({ hasData }) => {
  if (!hasData) return null;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col items-start gap-2">
        <DateRangePicker />
        <div className="h-full w-px bg-gray-300" />
        <DimensionsAndMetricsPicker />
      </div>
    </div>
  );
};
