"use client";
import React, { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ITypeParsedOmpData } from "@/types/data";
import rawDataJson from "@/data/normalized_omp_data.json";
import { parseOmpDataTypes } from "@/utils/parseNormalizedOmpData";
import { DateRangePicker } from "@/components/client/DateRangePicker";
import { format } from "date-fns";

const omProptechData = parseOmpDataTypes(rawDataJson);

const columnHelper = createColumnHelper<ITypeParsedOmpData>();

const customDateRangeFilter: FilterFn<ITypeParsedOmpData> = (row, columnId, filterValue, addMeta) => {
  const { startDate, endDate } = filterValue || {};

  // If no complete range is provided, don't filter out any rows.
  if (!startDate || !endDate) {
    if (addMeta) addMeta({ filtered: false });
    return true;
  }

  const cellValue = row.getValue(columnId);
  if (!cellValue) {
    if (addMeta) addMeta({ filtered: false });
    return false;
  }

  // Only proceed if cellValue is a string, number, or Date
  if (typeof cellValue !== "string" && typeof cellValue !== "number" && !(cellValue instanceof Date)) {
    if (addMeta) addMeta({ filtered: false });
    return false;
  }

  const cellDate = cellValue instanceof Date ? cellValue : new Date(cellValue as string | number);
  if (isNaN(cellDate.getTime())) {
    if (addMeta) addMeta({ filtered: false });
    return false;
  }

  const formatDate = (date: Date): string => format(date, "yyyy-MM-dd");
  const effectiveEndDate = endDate || startDate; // If endDate is missing, treat the filter as a single-date filter

  const cellDateStr = formatDate(cellDate);
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(effectiveEndDate);

  const isInRange = cellDateStr >= startDateStr && cellDateStr <= endDateStr;
  if (addMeta) addMeta({ isInRange });
  return isInRange;
};

const columns = [
  columnHelper.accessor("campaign_id", {
    header: "Campaign ID",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("campaign_name", {
    header: "Campaign Name",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("ad_group_id", {
    header: "Ad Group ID",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("ad_group_name", {
    header: "Ad Group Name",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => (row.date ? new Date(row.date) : new Date(0)), {
    id: "date",
    header: "Date",
    cell: (props) => {
      const date = props.getValue();
      return date.getTime() === 0
        ? "-"
        : date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
    },
    footer: (props) => props.column.id,
    filterFn: customDateRangeFilter,
  }),
  columnHelper.accessor("cost_micros", {
    header: "Cost (micros)",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("impressions", {
    header: "Impressions",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("clicks", {
    header: "Clicks",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("sessions", {
    header: "Sessions",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("leads", {
    header: "Leads",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("revenue", {
    header: "Revenue",
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
  }),
];

export const TableClient = () => {
  const [tableData, setTableData] = useState<ITypeParsedOmpData[]>([]);

  const [filtersState, setFiltersState] = useState<{
    date: { startDate: Date | null; endDate: Date | null };
  }>({
    date: { startDate: null, endDate: null },
  });

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
  });

  // Functions
  const handleFilter = () => {
    const activeFilters = Object.entries(filtersState)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([id, value]) => ({ id, value }));
    table.setColumnFilters(activeFilters);
  };

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="p-2">
      {/* Pagination controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
        <span>
          Rows {pageIndex * pageSize + 1}-{Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}
        </span>
      </div>
      <div className="mb-4">
        <label className="mr-2 font-medium">Select Table:</label>
        <select
          className="border p-2 rounded"
          onChange={(e) => {
            if (e.target.value === "om_proptech") {
              setTableData([...omProptechData]);
            } else {
              setTableData([]);
            }
          }}
          defaultValue=""
        >
          <option value="">-- Choose an option --</option>
          <option value="om_proptech">OM Proptech Normalized Table</option>
        </select>
      </div>
      {tableData.length > 0 && (
        <>
          <DateRangePicker onDateRangeChange={(range) => setFiltersState({ ...filtersState, date: range })} />
          <button className="bg-red-400 cursor-pointer p-4 rounded-4xl" onClick={handleFilter}>
            Filter
          </button>
        </>
      )}

      <table className="text-center">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 px-4 py-2">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td className="border border-gray-300 px-4 py-2" colSpan={columns.length}>
                Please select a table from the menu
              </td>
            </tr>
          ) : (
            table.getPaginationRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border border-gray-300 px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id} className="bg-gray-100">
              {footerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 px-4 py-2">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
    </div>
  );
};
