"use client";

import { setSelectedDateRange } from "@/store/slices/dataExplorerSlice";
import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const DateRangePicker: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedDateRange } = useSelector(
    (state: RootState) => state.dataExplorer,
  );

  const handleDateChange = (date: DateObject | DateObject[] | null) => {
    const newRange: { startDate: Date | null; endDate: Date | null } = {
      startDate: null,
      endDate: null,
    };
    if (Array.isArray(date)) {
      newRange.startDate = date[0] ? date[0].toDate() : null;
      newRange.endDate = date[1] ? date[1].toDate() : null;
    } else if (date) {
      // For single date selection, use it as both start and end
      const singleDate = date.toDate();
      newRange.startDate = singleDate;
      newRange.endDate = singleDate;
    }

    dispatch(
      setSelectedDateRange({
        startDate: newRange.startDate?.toISOString() || null,
        endDate: newRange.endDate?.toISOString() || null,
      }),
    );
  };

  const handleClose = () => {
    // When the picker closes, if only one date is selected, treat it as a single-day filter.
    if (Object.values(selectedDateRange).filter(Boolean).length === 1) {
      const date = new Date(
        selectedDateRange.startDate || selectedDateRange.endDate || "",
      );
      dispatch(
        setSelectedDateRange({
          startDate: date.toISOString() || null,
          endDate: date.toISOString() || null,
        }),
      );
    }
  };

  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-2">Select Date Range</h3>
      <DatePicker
        value={[selectedDateRange.startDate, selectedDateRange.endDate]}
        onChange={handleDateChange}
        onClose={handleClose}
        range
        inputClass="w-60 px-2 py-1 border"
      />
    </div>
  );
};
