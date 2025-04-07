"use client";
import { ITypeParsedOmpData } from "@/types/data";
import {
  DIMENSION_KEY_ENUM,
  METRIC_KEY_ENUM,
  columnConfigs,
} from "@/constants";
import { createColumnHelper } from "@tanstack/react-table";

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
  return columnHelper.accessor(
    config.key as DIMENSION_KEY_ENUM | METRIC_KEY_ENUM,
    {
      header: config.header,
      cell: config.cell || ((props) => props.getValue() ?? "0"),
      footer: (props) => props.column.id,
    },
  );
});
