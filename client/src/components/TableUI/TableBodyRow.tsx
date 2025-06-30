import { flexRender, type Row } from '@tanstack/react-table';
import React from 'react'
import { TableCell, TableRow } from '@mui/material';
import type { TransactionItemType } from '../../redux/services/transaction/types';

type TableBodyRowProps = {
  row: Row<TransactionItemType>
};

const TableBodyRow: React.FC<TableBodyRowProps> = ({ row }) => {
  return (
    <TableRow>
      {row.getVisibleCells().map(({ id, column, getContext }) => (
        <TableCell key={id}>
          {flexRender(column.columnDef.cell, getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableBodyRow
