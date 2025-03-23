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
  columnHelper.accessor("date", {
    header: "Date",
    cell: (props) => (props.getValue() ? new Date(props.getValue()!).toLocaleDateString("en-US") : "-"),
    footer: (props) => props.column.id,
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

export function TableClient() {
  // const [data, _setData] = React.useState(() => [...defaultData]);
  const data = [...defaultData];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border-4 p-2">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
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
}
