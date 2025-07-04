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

const Transactions: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState(
    Columns.reduce((acc, col) => ({ ...acc, [col.id as string]: true }), {})
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const user = useAppSelector(CurrentUserSelector);

  const [transactionListTrigger, { data, isLoading, isFetching }] =
    TransactionApis.useLazyTransactionListQuery();

  useEffect(() => {
    if (user !== null) {
      transactionListTrigger(null);
    }
  }, [transactionListTrigger, user]);

  // Table
  const table = useReactTable({
    data: data?.transactions ?? [],
    columns: Columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    enableSorting: true,
    enableMultiSort: false,
    initialState: { sorting: [] },
  });

  return (
    <Box sx={{ height: "100%", bgcolor: "white" }}>
      <TransactionTable table={table} isLoading={isLoading || isFetching} />
    </Box>
  );
};

export default Transactions;
