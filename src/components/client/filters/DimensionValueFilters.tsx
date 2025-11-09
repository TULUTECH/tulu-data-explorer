"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DIMENSION_OBJS, DIMENSION_KEY_ENUM } from "@/constants";
import { RootState } from "@/store/store";
import {
  addDimensionFilter,
  removeDimensionFilter,
  updateDimensionFilter,
} from "@/store/slices/dataExplorerSlice";
import { DimensionValueMap } from "@/types/data";

interface DimensionValueFiltersProps {
  dimensionValueMap: DimensionValueMap;
}

export const DimensionValueFilters: React.FC<DimensionValueFiltersProps> = ({
  dimensionValueMap,
}) => {
  const dispatch = useDispatch();
  const { dimensionFilters } = useSelector(
    (state: RootState) => state.dataExplorer,
  );

  const handleDimensionChange = (id: string, dimensionValue: string) => {
    dispatch(
      updateDimensionFilter({
        id,
        changes: {
          dimension: dimensionValue as DIMENSION_KEY_ENUM,
          value: "",
        },
      }),
    );
  };

  const handleValueChange = (id: string, value: string) => {
    dispatch(
      updateDimensionFilter({
        id,
        changes: { value },
      }),
    );
  };

  const handleConnectorChange = (id: string, connector: "AND" | "OR") => {
    dispatch(
      updateDimensionFilter({
        id,
        changes: { connector },
      }),
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Dimension Value Filters</h3>
        <button
          type="button"
          className="text-sm px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
          onClick={() => dispatch(addDimensionFilter())}
        >
          + Add Filter
        </button>
      </div>

      {dimensionFilters.length === 0 && (
        <p className="text-sm text-gray-500">
          Add filters to build SQL-like clauses such as WHERE source =
          &ldquo;google&rdquo;.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {dimensionFilters.map((filter, index) => {
          const options = filter.dimension
            ? dimensionValueMap[filter.dimension as DIMENSION_KEY_ENUM] || []
            : [];

          return (
            <div
              key={filter.id}
              className="flex flex-col md:flex-row gap-3 md:items-center border border-gray-200 rounded-md p-3 bg-gray-50"
            >
              {index > 0 && (
                <div className="md:w-20">
                  <label
                    htmlFor={`connector-${filter.id}`}
                    className="text-xs text-gray-500 uppercase tracking-wide"
                  >
                    Join
                  </label>
                  <select
                    id={`connector-${filter.id}`}
                    className="w-full border border-gray-300 rounded-md px-2 py-2 bg-white"
                    value={filter.connector}
                    onChange={(event) =>
                      handleConnectorChange(
                        filter.id,
                        event.target.value as "AND" | "OR",
                      )
                    }
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
              )}

              <div className="flex-1">
                <label
                  htmlFor={`dimension-${filter.id}`}
                  className="text-xs text-gray-500"
                >
                  Dimension
                </label>
                <select
                  id={`dimension-${filter.id}`}
                  className="w-full border border-gray-300 rounded-md px-2 py-2 bg-white"
                  value={filter.dimension}
                  onChange={(event) =>
                    handleDimensionChange(filter.id, event.target.value)
                  }
                >
                  <option value="">-- Select dimension --</option>
                  {DIMENSION_OBJS.map((dimension) => (
                    <option key={dimension.value} value={dimension.value}>
                      {dimension.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label
                  htmlFor={`value-${filter.id}`}
                  className="text-xs text-gray-500"
                >
                  Value
                </label>
                <input
                  id={`value-${filter.id}`}
                  list={`dimension-values-${filter.id}`}
                  className="w-full border border-gray-300 rounded-md px-2 py-2"
                  value={filter.value}
                  onChange={(event) =>
                    handleValueChange(filter.id, event.target.value)
                  }
                  placeholder={
                    filter.dimension
                      ? "Select or type a value"
                      : "Choose a dimension first"
                  }
                  disabled={!filter.dimension}
                />
                <datalist id={`dimension-values-${filter.id}`}>
                  {options.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => dispatch(removeDimensionFilter(filter.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
