import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  VisibilityState,
  Updater,
  OnChangeFn,
} from "@tanstack/react-table";
import { ITypeParsedOmpData } from "@/types/data";
import { columns } from "@/helpers/columns";
import { AppDispatch } from "@/store/store";
import { columnOrder } from "@/helpers/columnConfig";

const INITIAL_TABLE_STATE = {
  pagination: {
    pageIndex: 0,
    pageSize: 100,
  },
  columnOrder,
};

interface TableConfigurationProps {
  tableData: ITypeParsedOmpData[];
  columnVisibility: VisibilityState;
  dispatch: AppDispatch;
  isMountedRef: React.RefObject<boolean>;
  setColumnVisibility: (visibility: VisibilityState) => void;
}

export const useTableConfiguration = ({
  tableData,
  columnVisibility,

  setColumnVisibility,
}: TableConfigurationProps) => {
  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    updaterOrValue: Updater<VisibilityState>,
  ) => {
    if (typeof updaterOrValue === "function") {
      setColumnVisibility(updaterOrValue(columnVisibility));
    } else {
      setColumnVisibility(updaterOrValue);
    }
  };
  return useReactTable({
    data: tableData,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    initialState: INITIAL_TABLE_STATE,
  });
};
