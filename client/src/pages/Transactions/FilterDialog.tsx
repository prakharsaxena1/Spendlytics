import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { SlideUpTransition } from "../../components/common/SlideupDialog";
import {
  Autocomplete,
  Box,
  Button,
  capitalize,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import type { TransactionItemType } from "../../redux/services/transaction/types";

const CategoryOptions = ["savings", "debt", "investments", "needs", "wants"];

const TODAY = dayjs();

const TransactionFilter: React.FC = () => {
  const [category, setCategory] =
    useState<TransactionItemType["category"]>("investments");
  const [transactionFromDate, setTransactionFromDate] = useState<Dayjs | null>(
    TODAY
  );
  const [transactionToDate, setTransactionToDate] = useState<Dayjs | null>(
    TODAY
  );

  return (
    <Stack flexGrow={1} direction="column" spacing={2}>
      {/* Category */}
      <Stack sx={{ width: "100%" }}>
        <Typography fontWeight={700} gutterBottom>
          Category {category === "savings" ? "(In-flow)" : "(Out-flow)"}
        </Typography>
        <Autocomplete
          renderInput={(props) => <TextField {...props} />}
          options={CategoryOptions}
          value={category}
          size="small"
          onChange={(_e, val) =>
            setCategory(val as TransactionItemType["category"])
          }
          disableClearable
          renderOption={(props) => (
            <Typography {...props}>{capitalize(props.key)}</Typography>
          )}
          renderValue={(value, getItemProps) => (
            <Typography {...getItemProps()}>{capitalize(value)}</Typography>
          )}
        />
      </Stack>
      {/* Transaction daterange */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box overflow="hidden">
            <Typography fontWeight={700} gutterBottom>
              From (DD/MM/YYYY)
            </Typography>
            <DatePicker
              value={transactionFromDate}
              onChange={(value) => setTransactionFromDate(value)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
              format="DD/MM/YYYY"
            />
          </Box>
          <Box overflow="hidden">
            <Typography fontWeight={700} gutterBottom>
              To (DD/MM/YYYY)
            </Typography>
            <DatePicker
              value={transactionToDate}
              onChange={(value) => setTransactionToDate(value)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
              format="DD/MM/YYYY"
            />
          </Box>
        </Stack>
      </LocalizationProvider>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Button variant="contained" color="inherit">
          Clear
        </Button>
        <Button variant="contained">Apply</Button>
      </Stack>
    </Stack>
  );
};

type FilterDialogProps = {
  open: boolean;
  handleClose: () => void;
};

const FilterDialog: React.FC<FilterDialogProps> = ({ open, handleClose }) => {
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
            <FilterAltIcon />
            <Typography variant="h5">Filter transactions</Typography>
          </Stack>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3, width: 500 }}>
          <TransactionFilter />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
