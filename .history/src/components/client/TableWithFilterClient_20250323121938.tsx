import React from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

export const TableWithFilterClient = () => {
  return (
    <div>TableWithFilterClient</div>
  )
}
