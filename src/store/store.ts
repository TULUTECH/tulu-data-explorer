import { configureStore } from "@reduxjs/toolkit";
import dataExplorerReducer from "./slices/dataExplorerSlice";

export const store = configureStore({
  reducer: {
    dataExplorer: dataExplorerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
