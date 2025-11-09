"use client";
import React from "react";
import { DateRangePicker } from "@/components/client/filters/DateRangePicker";
import { DimensionsAndMetricsPicker } from "@/components/client/filters/DimensionsAndMetricsPicker";
import { DimensionValueFilters } from "@/components/client/filters/DimensionValueFilters";
import { DimensionValueMap } from "@/types/data";

interface FiltersProps {
  hasData: boolean;
  dimensionValueMap: DimensionValueMap;
}

export const Filters: React.FC<FiltersProps> = ({
  hasData,
  dimensionValueMap,
}) => (
  <div
    className={`flex flex-col gap-6 mb-4 transition-opacity duration-500 ${hasData ? "opacity-100" : "opacity-90"}`}
  >
    <DateRangePicker />
    <DimensionsAndMetricsPicker />
    <DimensionValueFilters dimensionValueMap={dimensionValueMap} />
  </div>
);
