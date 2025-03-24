"use client";

import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

export const DateRangePicker = () => {
  // In range mode, we expect value to be an array of Date objects.
  const [value, setValue] = useState<Date[]>([]);

  const handleSetValue = (date: DateObject | DateObject[] | null) => {
    if (Array.isArray(date)) {
      // Filter out any nullish values and convert to native Date objects.
      setValue(date.filter(Boolean).map((d) => d.toDate()));
    } else {
      // If a single date is selected, wrap it in an array; if null, set an empty array.
      setValue(date ? [date.toDate()] : []);
    }
  };

  return (
    <>
      <h2>Custom Date Picker</h2>
      <DatePicker value={value} onChange={handleSetValue} range />
    </>
  );
};
