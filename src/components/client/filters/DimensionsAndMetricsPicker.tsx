"use client";
import React from "react";
import { DIMENSION_DATA_ENUM, METRIC_DATA_ENUM } from "@/types/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedDimensions, setSelectedMetrics } from "@/store/slices/dataExplorerSlice";
import { DIMENSION_OBJS, METRIC_OBJS } from "@/constants";
import Select, { MultiValue } from "react-select";

type OptionType = {
  value: DIMENSION_DATA_ENUM | METRIC_DATA_ENUM;
  label: string;
};

export const DimensionsAndMetricsPicker: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedDimensions, selectedMetrics } = useSelector((state: RootState) => state.dataExplorer);

  const handleDimensionChange = (selectedOptions: MultiValue<OptionType>) => {
    const selectedValues = selectedOptions.map((option) => option.value as DIMENSION_DATA_ENUM);
    let newDimensions: DIMENSION_DATA_ENUM[] = [...selectedValues];

    // Handle the special case for AdGroupId and CampaignName
    if (
      selectedValues.includes(DIMENSION_DATA_ENUM.AdGroupId) &&
      !selectedValues.includes(DIMENSION_DATA_ENUM.CampaignName)
    ) {
      // If AdGroupId is selected but CampaignName is not, add CampaignName
      newDimensions = [...newDimensions, DIMENSION_DATA_ENUM.CampaignName];
    }

    dispatch(setSelectedDimensions(newDimensions));
  };

  const handleMetricChange = (selectedOptions: MultiValue<OptionType>) => {
    const selectedValues = selectedOptions.map((option) => option.value as METRIC_DATA_ENUM);
    dispatch(setSelectedMetrics(selectedValues));
  };

  // Convert selected dimensions to the format expected by react-select
  const selectedDimensionOptions = DIMENSION_OBJS.filter((dimension) => selectedDimensions.includes(dimension.value));

  // Convert selected metrics to the format expected by react-select
  const selectedMetricOptions = METRIC_OBJS.filter((metric) => selectedMetrics.includes(metric.value));

  const isMetricsDisabled = selectedDimensions.length === 0;

  // Custom styles for the Select components
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: "#e5e7eb",
      borderRadius: "0.375rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d1d5db",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#374151",
      fontWeight: 500,
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#6b7280",
      "&:hover": {
        backgroundColor: "#e5e7eb",
        color: "#1f2937",
      },
    }),
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h3 className="font-medium text-gray-700 mb-2">Dimensions</h3>
        <Select
          isMulti
          name="dimensions"
          options={DIMENSION_OBJS.filter((option) => option.isSelectableForTable)}
          className="basic-multi-select"
          classNamePrefix="select"
          value={selectedDimensionOptions}
          onChange={handleDimensionChange}
          placeholder="Select dimensions..."
          styles={customStyles}
          closeMenuOnSelect={false}
        />
        {selectedDimensions.includes(DIMENSION_DATA_ENUM.AdGroupId) && (
          <p className="text-xs text-gray-500 mt-1">
            Note: Campaign Name is automatically selected when Ad Group is selected.
          </p>
        )}
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-2">Metrics</h3>
        <Select
          isMulti
          name="metrics"
          options={METRIC_OBJS}
          className="basic-multi-select"
          classNamePrefix="select"
          value={selectedMetricOptions}
          onChange={handleMetricChange}
          placeholder="Select metrics..."
          styles={customStyles}
          isDisabled={isMetricsDisabled}
          closeMenuOnSelect={false}
        />
        {isMetricsDisabled && (
          <p className="text-xs text-gray-500 mt-1">
            Please select at least one dimension to enable metrics selection.
          </p>
        )}
      </div>
    </div>
  );
};
