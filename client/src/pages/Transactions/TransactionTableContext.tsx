import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type Table as TableType,
} from "@tanstack/react-table";
import TransactionApis from "../../redux/services/transaction/api";
import type {
  TransactionItemType,
  TransactionListResponse,
} from "../../redux/services/transaction/types";
import Columns from "../../components/TableUI/columns/Transaction";
import { useSearchParams } from "react-router-dom";
import { CurrentUserSelector } from "../../redux/slices/auth/selector";
import { useAppSelector } from "../../redux/hooks";

type TxListTriggerType = ReturnType<
  typeof TransactionApis.useLazyTransactionListQuery
>[0];

type TxTableContextType = {
  table: TableType<TransactionItemType>;
  isTableLoading: boolean;
  txListTrigger: TxListTriggerType;
  handleChangePage: (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  page: number;
  limit: number;
  data: TransactionListResponse | undefined;
};

const TxTableContext = createContext<TxTableContextType | undefined>(undefined);

export const TxTableProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useAppSelector(CurrentUserSelector);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState(() =>
    Columns.reduce((acc, col) => ({ ...acc, [col.id as string]: true }), {})
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert URL params to numbers safely
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 25;

  const [txListTrigger, { data, isLoading, isFetching }] =
    TransactionApis.useLazyTransactionListQuery();

  useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      setSearchParams({ page: "1", limit: "25" });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (user !== null) {
      txListTrigger({
        page,
        limit,
      });
    }
  }, [limit, page, txListTrigger, user]);
  // Update page number in URL
  const handleChangePage = React.useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setSearchParams({
        page: (newPage + 1).toString(),
        limit: limit.toString(),
      });
    },
    [limit, setSearchParams]
  );

  // Update rows per page and reset to page 0 in URL
  const handleChangeRowsPerPage = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchParams({ page: "1", limit: event.target.value });
    },
    [setSearchParams]
  );

  const table = useReactTable({
    data: data?.transactions ?? [],
    columns: Columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    enableSorting: true,
    enableMultiSort: false,
    initialState: { sorting: [] },
  });

  const isTableLoading = isLoading || isFetching;

  const contextValue = React.useMemo(
    () => ({
      table,
      isTableLoading,
      txListTrigger,
      handleChangePage,
      handleChangeRowsPerPage,
      page,
      limit,
      data,
      sorting,
      columnFilters,
      columnVisibility,
    }),
    [
      columnFilters,
      columnVisibility,
      sorting,
      table,
      isTableLoading,
      txListTrigger,
      handleChangePage,
      handleChangeRowsPerPage,
      page,
      limit,
      data,
    ]
  );

  return (
    <TxTableContext.Provider value={contextValue}>
      {children}
    </TxTableContext.Provider>
  );
};

export const useTxTableContext = () => {
  const context = useContext(TxTableContext);
  if (!context) {
    throw new Error("TxTableContext must be used within a TxTableProvider");
  }
  return context;
};
