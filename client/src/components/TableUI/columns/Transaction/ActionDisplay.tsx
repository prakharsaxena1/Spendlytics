import React, { useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { UpdateTransactionRequest } from "../../../../redux/services/transaction/types";
import TransactionApis from "../../../../redux/services/transaction/api";
import { DialogActions, Button } from "@mui/material";
import SlideupDialog from "../../../common/SlideupDialog";
import FormSlideupDialog from "../../../common/FormSlideupDialog";
import TransactionForm from "../../../../pages/Transactions/TransactionForm";

type ActionDisplayProps = {
  row: UpdateTransactionRequest;
};

const ActionDisplay: React.FC<ActionDisplayProps> = ({ row }) => {
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // Edit
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  // Delete
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };
  const [deleteTrigger, { isLoading }] =
    TransactionApis.useDeleteTransactionMutation();
  const handleDeleteTransaction = () => {
    deleteTrigger({
      transactionId: row._id,
    }).then(() => {
      handleCloseDeleteDialog();
    });
  };
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton size="small" onClick={handleOpenEditDialog}>
        <EditIcon />
      </IconButton>
      <IconButton size="small" onClick={handleOpenDeleteDialog}>
        <DeleteIcon />
      </IconButton>
      <FormSlideupDialog
        open={openEditDialog}
        handleClose={handleCloseEditDialog}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <EditIcon />
            <Typography variant="h5">Edit transaction</Typography>
          </Stack>
        }
        content={
          <TransactionForm
            handleClose={handleCloseEditDialog}
            transaction={row}
          />
        }
      />
      <SlideupDialog
        title="Delete Transaction"
        message={
          <Box>
            <Typography>
              Are you sure you want to delete this transaction?
            </Typography>
            <Typography variant="caption" color="error">
              This action cannot be undone.
            </Typography>
          </Box>
        }
        open={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
      >
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTransaction}
            variant="contained"
            color="error"
            loading={isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </SlideupDialog>
    </Stack>
  );
};

export default ActionDisplay;
