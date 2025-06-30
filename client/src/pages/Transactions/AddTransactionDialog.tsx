import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import TransactionForm from "./TransactionForm";
import EditIcon from "@mui/icons-material/Edit";
import { SlideUpTransition } from "../../components/common/SlideupDialog";
import type { UpdateTransactionRequest } from "../../redux/services/transaction/types";

type AddTransactionDialogProps = {
  open: boolean;
  handleClose: () => void;
  transaction?: UpdateTransactionRequest;
};

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  handleClose,
  transaction,
}) => {
  return (
    <Dialog
      slots={{
        transition: SlideUpTransition,
      }}
      open={open}
      onClose={handleClose}
      maxWidth="lg"
    >
      <DialogTitle sx={{ bgcolor: "#ECF0F1" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {transaction === undefined ? <AddIcon /> : <EditIcon />}
            <Typography variant="h5">
              {transaction === undefined
                ? "Add a transaction"
                : "Edit transaction"}
            </Typography>
          </Stack>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TransactionForm handleClose={handleClose} transaction={transaction} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
