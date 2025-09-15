import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import Divider from "@mui/material/Divider";
import TableUI from "../../components/TableUI";
import TableToolbar from "./TableToolbar";
import { useTxTableContext } from "./TransactionTableContext";

const TransactionsUI: React.FC = () => {
  const {
    table,
    isTableLoading,
    data,
    page,
    limit,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTxTableContext();
  return (
    <Stack direction="column" sx={{ height: "100%" }}>
      <TableToolbar />
      <Divider />
      <Stack direction="column" sx={{ flexGrow: 1, overflow: "hidden" }}>
        <TableUI table={table} isLoading={isTableLoading} />
        <Divider />
        <Box>
          <TablePagination
            component="div"
            count={data?.total ?? 0}
            page={page - 1}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25]}
            size="small"
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default TransactionsUI;
