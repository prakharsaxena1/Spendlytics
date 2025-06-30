import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import { type Table as TableType } from "@tanstack/react-table";
import HeaderRow from "./HeaderRow";
import TableBodyRow from "./TableBodyRow";
import type { TransactionItemType } from "../../redux/services/transaction/types";
import React from "react";
import Loader from "../common/Loader";

type TableProps = {
  table: TableType<TransactionItemType>;
  isLoading: boolean;
};
const TableUI: React.FC<TableProps> = ({ table, isLoading }) => {
  return (
    <Box sx={{ flexGrow: 1, overflow: "auto", position: 'relative' }}>
      <Table stickyHeader size="small">
        <TableHead sx={{ bgcolor: "primary.main" }}>
          {table.getHeaderGroups().map(({ headers, id }) => (
            <HeaderRow
              key={id}
              headers={headers}
              sorting={table.getState().sorting}
            />
          ))}
        </TableHead>
        <TableBody sx={{ position: "relative" }}>
          {table.getRowModel().rows.map((row) => (
            <TableBodyRow key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
      {isLoading && (
        <Box sx={{ position: "absolute", inset: 0 }}>
          <Loader />
        </Box>
      )}
    </Box>
  );
};

export default TableUI;
