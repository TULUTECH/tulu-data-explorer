"use client";

import React from "react";
import { ITypeParsedOmpData } from "@/types/data";
import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface TableProps {
  table: TanstackTable<ITypeParsedOmpData>;
}

export const Table = ({ table }: TableProps) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const visibleColumns = table.getVisibleFlatColumns().length;
  const { selectedTable } = useSelector((state: RootState) => state.dataExplorer);

  if (!selectedTable) {
    return <div className="text-center py-4">Please select a table from the menu</div>;
  }

  if (visibleColumns === 0) {
    return <div className="text-center py-4">Please select dimensions and/or metrics</div>;
  }

  return (
    <div>
      {/* Pagination controls */}
      <div className="flex justify-left items-center mt-2 space-x-2 text-sm">
        <button
          className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <span>
          Rows {pageIndex * pageSize + 1}-{Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}
        </span>
      </div>
      <table className="text-center">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 px-4 py-2">
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
            <tr key={row.id}>
              <td className="border border-gray-300 px-4 py-2 font-bold">{rowIndex + 1}</td>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id} className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              {footerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 px-4 py-2">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};
