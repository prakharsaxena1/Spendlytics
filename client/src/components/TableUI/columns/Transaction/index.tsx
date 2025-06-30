import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { getFormattedDate } from "../../../../utils/helper";
import Typography from "@mui/material/Typography";
import CategoryDisplay from "./CategoryDisplay";
import ActionDisplay from "./ActionDisplay";
import { capitalize } from "@mui/material";
import type {
  TransactionItemType,
  UpdateTransactionRequest,
} from "../../../../redux/services/transaction/types";

const columnHelper = createColumnHelper<TransactionItemType>();

const columns = [
  columnHelper.accessor("transactionType", {
    header: "Money flow",
    cell: (info) => (
      <Typography
        variant="body2"
        fontWeight={700}
        color={info.getValue() === "inflow" ? "success" : "error"}
      >
        {capitalize(info.getValue())}
      </Typography>
    ),
    size: 150,
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => <CategoryDisplay categoryType={info.getValue()} />,
    size: 100,
    enableHiding: false,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => (
      <Typography variant="body2">Rs.{info.getValue()}</Typography>
    ),
    size: 120,
    enableHiding: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("transactionDate", {
    header: "Transaction date",
    cell: (info) => getFormattedDate(info.getValue()),
    size: 200,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("updatedAt", {
    header: "Last modified",
    cell: (info) => getFormattedDate(info.getValue()),
    size: 200,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("note", {
    header: "Comment",
    cell: (info) => info.getValue(),
    size: 320,
    enableSorting: false,
    enableColumnFilter: false,
  }),
  // columnHelper.accessor("isShared", {
  //   header: "Shared",
  //   cell: (info) => (info.getValue() ? "✔️" : null),
  //   size: 80,
  //   enableSorting: false,
  // }),
  columnHelper.display({
    header: "Action",
    cell: ({ row }) => (
      <ActionDisplay row={row.original as UpdateTransactionRequest} />
    ),
    size: 120,
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  }),
] as ColumnDef<TransactionItemType>[];

export default columns;
