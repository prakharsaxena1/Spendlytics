import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import Divider from "@mui/material/Divider";
import TableUI from "../../components/TableUI";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Table } from "@tanstack/react-table";
import type { TransactionItemType } from "../../redux/services/transaction/types";
import { Button } from "@mui/material";
import ColumnsToggle from "../../components/TableUI/ColumnsToggle";
import FilterDialog from "./FilterDialog";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import AddTransactionDialog from "./AddTransactionDialog";

type TransactionTableProps = {
  table: Table<TransactionItemType>;
  isLoading?: boolean;
};

const TransactionTable: React.FC<TransactionTableProps> = ({
  table,
  isLoading = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Convert URL params to numbers safely
  const page = Number(searchParams.get("page")) || 0;
  const rowsPerPage = Number(searchParams.get("limit")) || 25;

  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [openColumnsToggle, setOpenColumnsToggle] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      setSearchParams({ page: "0", limit: "25" });
    }
  }, [searchParams, setSearchParams]);

  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };
  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };
  const handleOpenColumnsToggle = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenColumnsToggle(true);
  };
  const handleCloseColumnsToggle = () => {
    setAnchorEl(null);
    setOpenColumnsToggle(false);
  };

  // Handlers
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  // Update page number in URL
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setSearchParams({
      page: newPage.toString(),
      limit: rowsPerPage.toString(),
    });
  };

  // Update rows per page and reset to page 0 in URL
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchParams({ page: "0", limit: event.target.value });
  };
  return (
    <Stack direction="column" sx={{ height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" sx={{ p: 1 }}>
        <Stack spacing={1} direction="row">
          <Button
            startIcon={<ViewColumnIcon />}
            color="inherit"
            onClick={handleOpenColumnsToggle}
          >
            Columns
          </Button>
          <Button
            startIcon={<FilterAltIcon />}
            color="inherit"
            onClick={handleOpenFilterDialog}
          >
            Filter
          </Button>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add
        </Button>
      </Stack>
      <Divider />
      <Stack direction="column" sx={{ flexGrow: 1, overflow: "hidden" }}>
        <TableUI table={table} isLoading={isLoading} />
        <Divider />
        <Box>
          <TablePagination
            component="div"
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25]}
            size="small"
          />
        </Box>
      </Stack>
      <FilterDialog
        open={openFilterDialog}
        handleClose={handleCloseFilterDialog}
      />
      <ColumnsToggle
        open={openColumnsToggle}
        onClose={handleCloseColumnsToggle}
        table={table}
        anchorEl={anchorEl}
      />
      <AddTransactionDialog
        open={openAddDialog}
        handleClose={handleCloseAddDialog}
      />
    </Stack>
  );
};

export default TransactionTable;
