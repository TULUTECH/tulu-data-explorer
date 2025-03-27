import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dimension, Metric, IDateRange } from "@/types/data";
import { GroupingState } from "@tanstack/react-table";

interface DataExplorerState {
  selectedDimensions: GroupingState;
  selectedMetrics: Metric[];
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedTable: string;
}

const initialState: DataExplorerState = {
  selectedDimensions: [],
  selectedMetrics: [],
  dateRange: {
    startDate: null,
    endDate: null,
  },
  selectedTable: "",
};

const dataExplorerSlice = createSlice({
  name: "dataExplorer",
  initialState,
  reducers: {
    setSelectedDimensions: (state, action: PayloadAction<Dimension[]>) => {
      state.selectedDimensions = action.payload;
    },
    setSelectedMetrics: (state, action: PayloadAction<Metric[]>) => {
      state.selectedMetrics = action.payload;
    },
    setDateRange: (state, action: PayloadAction<IDateRange>) => {
      state.dateRange = {
        startDate: action.payload.startDate || null,
        endDate: action.payload.endDate || null,
      };
    },
    setSelectedTable: (state, action: PayloadAction<string>) => {
      state.selectedTable = action.payload;
    },
  },
});

export const { setSelectedDimensions, setSelectedMetrics, setDateRange, setSelectedTable } = dataExplorerSlice.actions;
export default dataExplorerSlice.reducer;
