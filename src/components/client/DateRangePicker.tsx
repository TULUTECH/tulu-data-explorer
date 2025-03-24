"use client";

import { IDateRange } from "@/types/data";
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

interface DateRangePickerProps {
  onDateRangeChange: (range: IDateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange }) => {
  const [value, setValue] = useState<DateObject[]>([]);

  const handleSetValue = (date: DateObject | DateObject[] | null) => {
    const newRange: IDateRange = { startDate: null, endDate: null };
    if (Array.isArray(date)) {
      newRange.startDate = date[0] ? date[0].toDate() : null;
      newRange.endDate = date[1] ? date[1].toDate() : null;
    } else if (date) {
      newRange.startDate = date.toDate();
      newRange.endDate = null;
    }
    setValue(Array.isArray(date) ? date : []);
    onDateRangeChange(newRange);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Select Date Range</h2>
      <DatePicker value={value} onChange={handleSetValue} range />
    </div>
  );
};
