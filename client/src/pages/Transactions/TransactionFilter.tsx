import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  capitalize,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { TransactionItemType } from "../../redux/services/transaction/types";
import { CategoryOptions } from "../../constants/constants";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TransactionFilterSelector } from "../../redux/slices/transactionFilter/selector";
import {
  clearFilters,
  setCategories,
  setFromDate,
  setToDate,
} from "../../redux/slices/transactionFilter/slice";
import { useTxTableContext } from "./TransactionTableContext";

type TransactionFilterProps = {
  handleClose: () => void;
};

const TransactionFilter: React.FC<TransactionFilterProps> = ({
  handleClose,
}) => {
  const dispatch = useAppDispatch();
  const { txListTrigger, page, limit } = useTxTableContext();
  const { categories, fromDate, toDate } = useAppSelector(
    TransactionFilterSelector
  );

  const handleReset = () => {
    dispatch(clearFilters());
    txListTrigger({ page, limit });
    handleClose();
  };

  const handleApplyFilter = () => {
    dispatch(setCategories(categories));
    dispatch(setFromDate(fromDate));
    dispatch(setToDate(toDate));
    txListTrigger({ page, limit, categories, fromDate, toDate });
    handleClose();
  };

  return (
    <Box sx={{ p: 3, width: 500 }}>
      <Stack flexGrow={1} direction="column" spacing={2}>
        {/* Category */}
        <Stack sx={{ width: "100%" }}>
          <Typography fontWeight={700} gutterBottom>
            Category
          </Typography>
          <Autocomplete
            multiple
            options={CategoryOptions}
            value={categories}
            size="small"
            onChange={(_e, val) =>
              dispatch(setCategories(val as TransactionItemType["category"][]))
            }
            renderInput={(params) => <TextField {...params} />}
            renderOption={({ key, ...rest }, option) => (
              <li key={key} {...rest}>
                <Typography>{capitalize(option)}</Typography>
              </li>
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
                value={dayjs(fromDate)}
                onChange={(value) => {
                  if (value) {
                    dispatch(setFromDate(value.startOf("day").toISOString()));
                  }
                }}
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
                value={dayjs(toDate)}
                onChange={(value) => {
                  if (value) {
                    dispatch(setToDate(value.endOf("day").toISOString()));
                  }
                }}
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
          <Button variant="contained" color="inherit" onClick={handleReset}>
            Clear
          </Button>
          <Button variant="contained" onClick={handleApplyFilter}>
            Apply
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TransactionFilter;
