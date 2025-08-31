import React, { useEffect, useState } from "react";
import Columns from "../../components/TableUI/columns/Transaction";
import Box from "@mui/material/Box";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import TransactionTable from "./TransactionTable";
import TransactionApis from "../../redux/services/transaction/api";
import { useAppSelector } from "../../redux/hooks";
import { CurrentUserSelector } from "../../redux/slices/auth/selector";
import { useSearchParams } from "react-router-dom";

const Transactions: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState(
    Columns.reduce((acc, col) => ({ ...acc, [col.id as string]: true }), {})
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const user = useAppSelector(CurrentUserSelector);

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 25;

  const [transactionListTrigger, { data, isLoading, isFetching }] =
    TransactionApis.useLazyTransactionListQuery();

  useEffect(() => {
    if (user !== null) {
      transactionListTrigger({
        page,
        limit,
      });
    }
  }, [limit, page, transactionListTrigger, user]);

  // Table
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

  return (
    <Box sx={{ height: "100%" }}>
      <TransactionTable
        table={table}
        isLoading={isLoading || isFetching}
        total={data?.total ?? 0}
      />
    </Box>
  );
};

export default Transactions;
