"use client";

import React from "react";
import Select, { MultiValue, StylesConfig } from "react-select";
import { MetricTotals } from "@/types/data";
import {
  CALCULATION_DEFINITIONS,
  CALCULATION_OPTIONS,
  CalculationKey,
  CalculationDefinition,
} from "@/constants/calculations";

interface OptionType {
  value: CalculationKey;
  label: string;
  description: string;
}

interface CalculationsPanelProps {
  selectedKeys: CalculationKey[];
  onChange: (keys: CalculationKey[]) => void;
  totals: MetricTotals;
  disabled?: boolean;
}

const selectStyles: StylesConfig<OptionType, true> = {
  control: (provided) => ({
    ...provided,
    borderColor: "#e5e7eb",
    borderRadius: "0.5rem",
    boxShadow: "none",
    minHeight: "42px",
    "&:hover": {
      borderColor: "#c7d2fe",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    borderRadius: "0.375rem",
    backgroundColor: "#eef2ff",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#312e81",
    fontWeight: 500,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#4338ca",
    "&:hover": {
      backgroundColor: "#c7d2fe",
      color: "#312e81",
    },
  }),
};

const formatValue = (
  value: number,
  definition: CalculationDefinition,
): string => {
  if (definition.format === "currency") {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (definition.format === "percentage") {
    return `${value.toFixed(2)}%`;
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const CalculationsPanel: React.FC<CalculationsPanelProps> = ({
  selectedKeys,
  onChange,
  totals,
  disabled = false,
}) => {
  const selectedOptions = CALCULATION_OPTIONS.filter((option) =>
    selectedKeys.includes(option.value),
  );

  const handleChange = (options: MultiValue<OptionType>) => {
    const keys = options.map((option) => option.value);
    onChange(keys);
  };

  return (
    <section className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-indigo-100 transition-all duration-300 hover:shadow-lg flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-indigo-700">
          Step 3: Add Calculations
        </h3>
        <p className="text-sm text-gray-600">
          Choose any combination of metrics or derived KPIs (CTR, CPC, ROAS,
          etc.) to summarize the filtered dataset.
        </p>
      </div>

      <Select
        isMulti
        isDisabled={disabled}
        options={CALCULATION_OPTIONS}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={
          disabled
            ? "Load data before adding calculations."
            : "Select calculations to display..."
        }
        styles={selectStyles}
        classNamePrefix="select"
        closeMenuOnSelect={false}
      />

      {selectedKeys.length === 0 ? (
        <p className="text-sm text-gray-500">
          Select at least one calculation above to see summarized metrics.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedKeys.map((key) => {
            const definition = CALCULATION_DEFINITIONS[key];
            if (!definition) return null;
            const rawValue = definition.calculate(totals);

            return (
              <article
                key={key}
                className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-white to-indigo-50 shadow-sm"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  {definition.description}
                </p>
                <h4 className="text-lg font-semibold text-gray-800">
                  {definition.label}
                </h4>
                <p className="text-2xl font-bold text-indigo-700 mt-2">
                  {disabled ? "—" : formatValue(rawValue, definition)}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
