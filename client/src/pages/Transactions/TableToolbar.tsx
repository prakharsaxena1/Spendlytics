import React, { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import ColumnsToggle from "../../components/TableUI/ColumnsToggle";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import FormSlideupDialog from "../../components/common/FormSlideupDialog";
import TransactionFilter from "./TransactionFilter";
import TransactionForm from "./TransactionForm";
import { useTxTableContext } from "./TransactionTableContext";

const TableToolbar: React.FC = () => {
  const { table } = useTxTableContext();
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [openColumnsToggle, setOpenColumnsToggle] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

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

  return (
    <>
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
      <FormSlideupDialog
        open={openFilterDialog}
        handleClose={handleCloseFilterDialog}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterAltIcon />
            <Typography variant="h5">Filter transactions</Typography>
          </Stack>
        }
        content={<TransactionFilter handleClose={handleCloseFilterDialog} />}
      />
      <ColumnsToggle
        open={openColumnsToggle}
        onClose={handleCloseColumnsToggle}
        cols={table.getAllLeafColumns()}
        anchorEl={anchorEl}
      />
      <FormSlideupDialog
        open={openAddDialog}
        handleClose={handleCloseAddDialog}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <AddIcon />
            <Typography variant="h5">Add a transaction</Typography>
          </Stack>
        }
        content={<TransactionForm handleClose={handleCloseAddDialog} />}
      />
    </>
  );
};

export default TableToolbar;
