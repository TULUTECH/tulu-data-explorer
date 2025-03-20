"use client";

import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { NormalizedDataFields } from "@/types/bigquery";
// Define the prop types
interface DataTableClientProps {
  initialData: NormalizedDataFields[];
}

export function DataTableClient({ initialData }: DataTableClientProps) {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const handleFetchData = () => {
    console.log("Fetching data:", {
      table: selectedTable,
      dateRange,
      initialData,
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Table Selection */}
      <div>
        <label className="block mb-2 font-bold">Select Table</label>
        <select
          value={selectedTable || ""}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Table</option>
          <option value="omp_normalized">OMP Normalized</option>
        </select>
      </div>

      {/* Date Range Picker */}
      <div>
        <label className="block mb-2 font-bold">Select Date Range</label>
        <Datepicker value={dateRange} onChange={(newValue) => setDateRange(newValue)} primaryColor="blue" />
      </div>

      {/* Fetch Data Button */}
      <button
        onClick={handleFetchData}
        disabled={!selectedTable || !dateRange.startDate}
        className={`
          w-full p-2 rounded 
          ${
            !selectedTable || !dateRange.startDate
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }
        `}
      >
        Fetch Data
      </button>
    </div>
  );
}

export default DataTableClient;
