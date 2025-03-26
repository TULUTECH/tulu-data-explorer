"use client";

import { IDateRange } from "@/types/data";
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

interface DateRangePickerProps {
  onDateRangeChange: (range: IDateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange }) => {
  const [selectedDates, setSelectedDates] = useState<DateObject[]>([]);

  const handleDateChange = (date: DateObject | DateObject[] | null) => {
    const newRange: IDateRange = { startDate: null, endDate: null };
    if (Array.isArray(date)) {
      newRange.startDate = date[0] ? date[0].toDate() : null;
      newRange.endDate = date[1] ? date[1].toDate() : null;
    } else if (date) {
      newRange.startDate = date.toDate();
      newRange.endDate = null;
    }
    setSelectedDates(Array.isArray(date) ? date : []);
    // Only update on change if two dates are selected.
    if (Array.isArray(date) && date.length === 2) {
      onDateRangeChange(newRange);
    }
  };

  const handleClose = () => {
    // When the picker closes, if only one date is selected, treat it as a single-day filter.
    if (selectedDates.length === 1) {
      const date = selectedDates[0].toDate();
      onDateRangeChange({ startDate: date, endDate: date });
    }
  };

  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-2">Select Date Range</h3>
      <DatePicker
        value={selectedDates}
        onChange={handleDateChange}
        onClose={handleClose}
        range
        inputClass="w-50 px-2 py-1 border"
      />
    </div>
  );
};
