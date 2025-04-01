"use client";
import { Dimension, DIMENSIONS, ITypeParsedOmpData, Metric } from "@/types/data";
import { createColumnHelper, FilterFn } from "@tanstack/react-table";
import { columnConfigs } from "./columnConfig";

export const columnHelper = createColumnHelper<ITypeParsedOmpData>();



export const columns = columnConfigs.map((config) => {
  if (config.key === "date" && config.accessorFn) {
    return columnHelper.accessor(config.accessorFn, {
      id: config.key,
      header: config.header,
      cell: (props) => {
        const dateValue = props.getValue();
        if (!(dateValue instanceof Date) || isNaN(dateValue.getTime()) || dateValue.getTime() === 0) {
          return "-";
        }
        return dateValue.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      },
      footer: (props) => props.column.id,
      filterFn: config.filterFn,
    });
  }
  return columnHelper.accessor(config.key as Dimension | Metric, {
    header: config.header,
    cell: (props) => props.getValue() ?? "0",
    footer: (props) => props.column.id,
    enableGrouping: config.enableGrouping,
  });
});
