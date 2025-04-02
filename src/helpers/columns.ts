"use client";
import { DIMENSION_ENUM, DIMENSION_OBJS, ITypeParsedOmpData, METRIC_ENUM } from "@/types/data";
import { createColumnHelper, FilterFn } from "@tanstack/react-table";
import { columnConfigs } from "./columnConfig";

export const columnHelper = createColumnHelper<ITypeParsedOmpData>();

export const columns = columnConfigs.map((config) => {
  if (config.key === "date" && config.accessorFn) {
    return columnHelper.accessor(config.accessorFn, {
      id: config.key,
      header: config.header,
      cell: config.cell,
      footer: (props) => props.column.id,
      filterFn: config.filterFn,
    });
  }
  return columnHelper.accessor(config.key as DIMENSION_ENUM | METRIC_ENUM, {
    header: config.header,
    cell: config.cell || ((props) => props.getValue() ?? "0"),
    footer: (props) => props.column.id,
  });
});
