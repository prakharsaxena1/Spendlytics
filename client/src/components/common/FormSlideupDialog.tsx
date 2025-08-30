import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { SlideUpTransition } from "./SlideupDialog";
import CloseIcon from "@mui/icons-material/Close";

type FormSlideupDialogProps = {
  open: boolean;
  handleClose: () => void;
  title: React.ReactElement;
  content: React.ReactElement;
};

const FormSlideupDialog: React.FC<FormSlideupDialogProps> = ({
  open,
  handleClose,
  title,
  content,
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
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {title}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
};

export default FormSlideupDialog;
