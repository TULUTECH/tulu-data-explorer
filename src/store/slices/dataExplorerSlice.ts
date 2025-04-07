import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DIMENSION_KEY_ENUM, METRIC_KEY_ENUM, IDateRange } from "@/types/data";

interface DataExplorerState {
  selectedDimensions: DIMENSION_KEY_ENUM[];
  selectedMetrics: METRIC_KEY_ENUM[];
  selectedDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedTable: string;
}

const initialState: DataExplorerState = {
  selectedDimensions: [],
  selectedMetrics: [],
  selectedDateRange: {
    startDate: null,
    endDate: null,
  },
  selectedTable: "",
};

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
    resetFilters: (state) => {
      state.selectedDimensions = [];
      state.selectedMetrics = [];
      state.selectedDateRange = { startDate: null, endDate: null };
      state.selectedTable = "";
    },
  },
});

export const {
  setSelectedTable,
  setSelectedDateRange,
  setSelectedDimensions,
  setSelectedMetrics,
  resetFilters,
} = dataExplorerSlice.actions;
export default dataExplorerSlice.reducer;
