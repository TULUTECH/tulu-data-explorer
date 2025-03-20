'use client'

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {NormalizedDataFields} from "@/types/bigquery";