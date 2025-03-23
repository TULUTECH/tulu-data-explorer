"use client";

import { useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";

export default function TableWithFilter({ data }) {
  const [filter, setFilter] = useState("");

  const columns = [
    { accessorKey: "campaign", header: "Campaign" },
    { accessorKey: "ad_group", header: "Ad Group" },
    { accessorKey: "clicks", header: "Clicks" },
    { accessorKey: "sessions", header: "Sessions" },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      {/* Filtering Input */}
      <input
        type="text"
        placeholder="Search campaigns or groups..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {/* Table UI */}
      <table className="min-w-full table-auto border-collapse border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2 bg-gray-100 text-left">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
