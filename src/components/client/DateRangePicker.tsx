"use client";

import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

interface DateRangePickerProps {
  onDateRangeChange: (range: IDateRange) => void;
}
interface IDateRange {
  startDate: Date | null;
  endDate: Date | null;
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
    onDateRangeChange(newRange);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Select Date Range</h2>
      <DatePicker value={selectedDates} onChange={handleDateChange} range inputClass="w-50 px-2 py-1 border" />
    </div>
  );
};
