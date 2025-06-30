import React, { useState } from "react";
import { IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { UpdateTransactionRequest } from "../../../../redux/services/transaction/types";
import TransactionApis from "../../../../redux/services/transaction/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { SlideUpTransition } from "../../../common/SlideupDialog";
import AddTransactionDialog from "../../../../pages/Transactions/AddTransactionDialog";

const ActionDisplay: React.FC<{ row: UpdateTransactionRequest }> = ({ row }) => {
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
  const [deleteTrigger] = TransactionApis.useDeleteTransactionMutation();
  const handleDeleteTransaction = () => {
    deleteTrigger({
      transactionId: row._id,
      userId: row.userId,
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

      <AddTransactionDialog
        open={openEditDialog}
        handleClose={handleCloseEditDialog}
        transaction={row}
      />

      <Dialog
        slots={{
          transition: SlideUpTransition,
        }}
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTransaction}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ActionDisplay;
