"use client";

import React from "react";
import { ITypeParsedOmpData } from "@/types/data";
import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UI_MESSAGES } from "@/constants/uiMessages";

interface TableProps {
  table: TanstackTable<ITypeParsedOmpData>;
}

export const Table = ({ table }: TableProps) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getGroupedRowModel().rows.length;
  const visibleColumns = table.getVisibleFlatColumns().length;
  const { selectedTable } = useSelector((state: RootState) => state.dataExplorer);
  if (!selectedTable) {
    return <div className="text-center py-4 text-gray-500 italic">{UI_MESSAGES.NO_TABLE_SELECTED}</div>;
  }

  if (visibleColumns === 0) {
    return <div className="text-center py-4 text-gray-500 italic">{UI_MESSAGES.NO_FILTERS_SELECTED}</div>;
  }

  return (
    <div className="w-full">
      {/* Pagination controls */}
      <div className="flex flex-wrap justify-between items-center mb-3 text-xs sm:text-sm">
        <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-0">
          <button
            className="px-1 sm:px-2 py-1 bg-indigo-200 hover:bg-indigo-300 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <span className="whitespace-nowrap">
            Page {pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <button
            className="px-1 sm:px-2 py-1 bg-indigo-200 hover:bg-indigo-300 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
          {/* Page size selector */}
          <div className="flex justify-end">
            <select
              className="text-xs sm:text-sm border border-indigo-200 rounded p-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
          <span>
            Rows {totalRows ? pageIndex * pageSize + 1 : 0}-{Math.min((pageIndex + 1) * pageSize, totalRows)} of{" "}
            {totalRows}
          </span>
        </div>
      </div>
      {/* Table with horizontal scroll capability */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="min-w-full text-center border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-indigo-50">
                <th className="border border-indigo-200 px-2 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-indigo-800 sticky left-0 bg-indigo-50 z-10">
                  #
                </th>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-indigo-200 px-2 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-indigo-800"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                            ? " 🔽"
                            : ""}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="border border-indigo-200 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold sticky left-0 bg-white z-10 hover:bg-indigo-50">
                  {rowIndex + 1}
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border border-indigo-200 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id} className="bg-indigo-50">
                <th className="border border-indigo-200 px-2 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-indigo-800 sticky left-0 bg-indigo-50 z-10">
                  #
                </th>
                {footerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-indigo-200 px-2 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-indigo-800"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
};
