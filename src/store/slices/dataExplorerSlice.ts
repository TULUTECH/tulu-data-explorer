import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDateRange, IDimensionValueFilter } from "@/types/data";
import { DIMENSION_KEY_ENUM, METRIC_KEY_ENUM } from "@/constants";

interface DataExplorerState {
  selectedDimensions: DIMENSION_KEY_ENUM[];
  selectedMetrics: METRIC_KEY_ENUM[];
  selectedDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedTable: string;
  dimensionFilters: IDimensionValueFilter[];
}

const initialState: DataExplorerState = {
  selectedDimensions: [],
  selectedMetrics: [],
  selectedDateRange: {
    startDate: null,
    endDate: null,
  },
  selectedTable: "",
  dimensionFilters: [],
};

const createEmptyFilter = (): IDimensionValueFilter => ({
  id: Math.random().toString(36).slice(2),
  dimension: "",
  operator: "equals",
  value: "",
  connector: "AND",
});

const dataExplorerSlice = createSlice({
  name: "dataExplorer",
  initialState,
  reducers: {
    setSelectedTable: (state, action: PayloadAction<string>) => {
      state.selectedTable = action.payload;
    },
    setSelectedDateRange: (state, action: PayloadAction<IDateRange>) => {
      state.selectedDateRange = {
        startDate: action.payload.startDate || null,
        endDate: action.payload.endDate || null,
      };
    },
    setSelectedDimensions: (
      state,
      action: PayloadAction<DIMENSION_KEY_ENUM[]>,
    ) => {
      state.selectedDimensions = action.payload;
    },
    setSelectedMetrics: (state, action: PayloadAction<METRIC_KEY_ENUM[]>) => {
      state.selectedMetrics = action.payload;
    },
    addDimensionFilter: (state) => {
      state.dimensionFilters.push(createEmptyFilter());
    },
    updateDimensionFilter: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<IDimensionValueFilter, "id">>;
      }>,
    ) => {
      const filter = state.dimensionFilters.find(
        (item) => item.id === action.payload.id,
      );
      if (filter) {
        Object.assign(filter, action.payload.changes);
      }
    },
    removeDimensionFilter: (state, action: PayloadAction<string>) => {
      state.dimensionFilters = state.dimensionFilters.filter(
        (filter) => filter.id !== action.payload,
      );
    },
    resetFilters: (state) => {
      state.selectedDimensions = [];
      state.selectedMetrics = [];
      state.selectedDateRange = { startDate: null, endDate: null };
      state.selectedTable = "";
      state.dimensionFilters = [];
    },
  },
});

export const {
  setSelectedTable,
  setSelectedDateRange,
  setSelectedDimensions,
  setSelectedMetrics,
  addDimensionFilter,
  updateDimensionFilter,
  removeDimensionFilter,
  resetFilters,
} = dataExplorerSlice.actions;
export default dataExplorerSlice.reducer;
