import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";

export const SlideUpTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type SlideupDialogProps = {
  title: string;
  message: string;
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
};

const SlideupDialog: React.FC<SlideupDialogProps> = (props) => {
  const { title, message, open, handleClose, children } = props;
  return (
    <Dialog
      open={open}
      slots={{
        transition: SlideUpTransition,
      }}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {message}
        </DialogContentText>
      </DialogContent>
      {children}
    </Dialog>
  );
};

export default SlideupDialog;
