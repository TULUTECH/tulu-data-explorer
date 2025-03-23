"use client";
import React from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ITypeParsedOmpData } from "@/types/data";
import rawDataJson from "@/data/normalized_omp_data.json";
import { parseOmpDataTypes } from "@/utils/utils/parseNormalizedOmpData";

const defaultData = parseOmpDataTypes(rawDataJson);

const columnHelper = createColumnHelper<ITypeParsedOmpData>();

const columns = [
  columnHelper.accessor("campaign_id", {
    header: "Campaign ID",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("campaign_name", {
    header: "Campaign Name",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("ad_group_id", {
    header: "Ad Group ID",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("ad_group_name", {
    header: "Ad Group Name",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => (info.getValue() ? new Date(info.getValue()!).toLocaleDateString("en-US") : "-"),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("cost_micros", {
    header: "Cost (micros)",
    cell: (info) => info.getValue() ?? "0",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("impressions", {
    header: "Impressions",
    cell: (info) => info.getValue() ?? "0",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("clicks", {
    header: "Clicks",
    cell: (info) => info.getValue() ?? "0",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("sessions", {
    header: "Sessions",
    cell: (info) => info.getValue() ?? "0",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("leads", {
    header: "Leads",
    cell: (info) => info.getValue() ?? "0",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("revenue", {
    header: "Revenue",
    cell: (info) => info.getValue() ?? "0",
    footer: (info) => info.column.id,
  }),
];

export function TableClient() {
  const [data, _setData] = React.useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
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
}
