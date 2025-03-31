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
import { Dimension, ITypeParsedOmpData } from "@/types/data";
import { columns } from "@/helpers/columns";
import { setSelectedDimensions } from "@/store/slices/dataExplorerSlice";
import { AppDispatch } from "@/store/store";

const INITIAL_TABLE_STATE = {
  pagination: {
    pageIndex: 0,
    pageSize: 100,
  },
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
  dispatch,
  isMountedRef,
  setColumnVisibility,
}: TableConfigurationProps) => {
  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (updaterOrValue: Updater<VisibilityState>) => {
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
