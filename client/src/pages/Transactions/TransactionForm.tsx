import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  capitalize,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FormInput from "../../components/common/FormInput";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { UpdateTransactionRequest, TransactionItemType, CreateTransactionRequest } from "../../redux/services/transaction/types";
import TransactionApis from "../../redux/services/transaction/api";
import { useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import { CurrentUserSelector } from "../../redux/slices/auth/selector";

const CategoryOptions: TransactionItemType['category'][] = ["savings", "debt", "investments", "needs", "wants"];

const TODAY = dayjs().toISOString();

type TransactionFormProps = {
  handleClose: () => void;
  transaction?: UpdateTransactionRequest;
};

const TransactionForm: React.FC<TransactionFormProps> = ({
  handleClose,
  transaction,
}) => {
  const [category, setCategory] = useState<TransactionItemType["category"]>(
    transaction?.category ?? "investments"
  );
  const [amount, setAmount] = useState<string>(
    (transaction?.amount ?? 0).toString()
  );
  const [transactionDate, setTransactionDate] = useState<string>(
    transaction?.transactionDate ?? TODAY
  );
  const [note, setNote] = useState<string>(transaction?.note ?? "");

  const [createTransactionTrigger] = TransactionApis.useCreateTransactionMutation();
  const [updateTransactionTrigger] = TransactionApis.useUpdateTransactionMutation();
  const user = useAppSelector(CurrentUserSelector);

  const handleSubmit = () => {
    const amt = Number(amount);
    if (user === null || !amt) {
      return;
    }
    const transactionObj: CreateTransactionRequest = {
      transactionType: category === "savings" ? "inflow" : "outflow",
      category,
      amount: Number(amount),
      transactionDate: transactionDate,
      note,
    };

    if (transaction !== undefined) {
      // Update
      const updateTransactionPromise = updateTransactionTrigger({
        ...transactionObj,
        _id: transaction._id
      })
        .unwrap()
        .then(() => {
          handleClose();
        });
      toast.promise(updateTransactionPromise, {
        pending: "Updating transaction",
        success: "Transaction updated successfully",
        error: "Unable to update transaction",
      });
    } else {
      // Create
      const createTransactionPromise = createTransactionTrigger(transactionObj)
        .unwrap()
        .then(() => {
          handleClose();
        });
      toast.promise(createTransactionPromise, {
        pending: "Creating transaction",
        success: "Transaction added successfully",
        error: "Unable to add transaction",
      });
    }
  };

  return (
    <Box sx={{ p: 3, width: 500 }}>
      <Stack flexGrow={1} direction="column" spacing={2}>
        {/* Transaction date */}
        <Box>
          <Typography fontWeight={700} gutterBottom>
            Date (DD/MM/YYYY)
          </Typography>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dayjs(transactionDate)}
                onChange={(value) => setTransactionDate(value?.toISOString() ?? TODAY)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Stack spacing={2} direction="row">
          {/* Amount */}
          <FormInput
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Enter amount"
          />
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
        </Stack>
        {/* Note */}
        <FormInput
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          multiline
          placeholder="Add a note (optional)"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default TransactionForm;
