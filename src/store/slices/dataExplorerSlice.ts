import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dimension, Metric } from "@/components/client/DimensionsAndMetricsPicker";
import { IDateRange } from "@/types/data";

interface DataExplorerState {
  selectedDimensions: Dimension[];
  selectedMetrics: Metric[];
  dateRange: IDateRange;
}

const initialState: DataExplorerState = {
  selectedDimensions: [],
  selectedMetrics: [],
  dateRange: {
    startDate: null,
    endDate: null,
  },
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
      state.dateRange = action.payload;
    },
  },
});

export const { setSelectedDimensions, setSelectedMetrics, setDateRange } = dataExplorerSlice.actions;
export default dataExplorerSlice.reducer;
