"use client";

import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

export const DateRangePicker = () => {
  const [value, setValue] = useState<Date[]>([]);

  const handleSetValue = (date: DateObject | DateObject[] | null) => {
    if (Array.isArray(date)) {
      setValue(date.filter(Boolean).map((d) => d.toDate()));
    } else {
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
