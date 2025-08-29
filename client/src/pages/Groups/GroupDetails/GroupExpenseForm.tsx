import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import FormInput from "../../../components/common/FormInput";
import { Divider } from "@mui/material";
import type { MemberType } from "../../../redux/services/user";
import { TODAY } from "../../../constants/constants";
import {
  GroupTransactionApis,
  type AddGroupTransactionRequest,
  type EditGroupTransactionResponse,
} from "../../../redux/services/group";
import { useParams } from "react-router-dom";

type SplitAmountBoxProps = {
  value: number;
  onChange: (newValue: number) => void;
  member: MemberType;
};

const SplitAmountBox: React.FC<SplitAmountBoxProps> = ({
  value,
  onChange,
  member,
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    p={0.5}
  >
    <Stack direction="column" flexGrow={1}>
      <Typography variant="body2">
        {member.firstname} {member.lastname}
      </Typography>
      <Typography variant="caption">@{member.username}</Typography>
    </Stack>
    <TextField
      size="small"
      fullWidth
      type="number"
      sx={{ maxWidth: 120 }}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </Stack>
);

type GroupExpenseFormProps = {
  members: MemberType[];
  handleClose: () => void;
  transaction?: EditGroupTransactionResponse["transaction"];
};

const GroupExpenseForm: React.FC<GroupExpenseFormProps> = ({
  members,
  handleClose,
  transaction,
}) => {
  const { id } = useParams();
  const [amount, setAmount] = useState<string>(
    transaction?.amount.toString() ?? "0"
  );
  const [transactionDate, setTransactionDate] = useState<string>(
    transaction?.transactionDate ?? TODAY
  );
  const [selectedSplitType, setSelectedSplitType] = useState<
    "percentage" | "value"
  >(transaction?.splitType ?? "value");
  const [note, setNote] = useState(transaction?.note ?? "");
  const [split, setSplit] = useState<Record<string, number>>(
    transaction?.splitDetails ?? {}
  );

  const [createGroupTransactionTrigger, { isLoading }] =
    GroupTransactionApis.useAddGroupTransactionMutation();
  const [editGroupTransactionTrigger, { isLoading: editLoading }] =
    GroupTransactionApis.useEditGroupTransactionMutation();

  // initialize split slots when members change
  useEffect(() => {
    if (transaction !== undefined) {
      setSplit(transaction.splitDetails);
    } else {
      const obj: Record<string, number> = {};
      members.forEach((m) => (obj[m._id] = 0));
      setSplit(obj);
    }
  }, [members, transaction]);

  // compute sum of splits
  const total = useMemo(
    () => Object.values(split).reduce((sum, v) => sum + v, 0),
    [split]
  );

  // numeric amount for comparison
  const numericAmount = useMemo(() => Number(amount) || 0, [amount]);

  // validation: percentages must total 100, values must total amount
  const isValid = useMemo(() => {
    if (selectedSplitType === "percentage") {
      return Math.abs(total - 100) < 1e-6;
    } else {
      return Math.abs(total - numericAmount) < 1e-6;
    }
  }, [selectedSplitType, total, numericAmount]);

  const handleSubmit = () => {
    const transactionObj: AddGroupTransactionRequest = {
      groupId: id ?? "",
      amount: Number(amount),
      transactionDate,
      splitType: selectedSplitType,
      splitDetails: split,
      note,
    };

    if (transaction !== undefined) {
      editGroupTransactionTrigger({
        transactionId: transaction?._id,
        ...transactionObj,
      });
    } else {
      createGroupTransactionTrigger(transactionObj).then(() => {
        handleClose();
      });
    }
  };

  return (
    <Box sx={{ p: 3, width: 500 }}>
      <Stack flexGrow={1} direction="column" spacing={2}>
        <Stack spacing={2} direction="row">
          {/* Transaction date */}
          <Box>
            <Typography fontWeight={700} gutterBottom>
              Date (DD/MM/YYYY)
            </Typography>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(transactionDate)}
                  onChange={(value) =>
                    setTransactionDate(value?.toISOString() ?? TODAY)
                  }
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
          {/* Amount */}
          <FormInput
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Enter amount"
          />
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
        <Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontWeight={700}>Split by:</Typography>
            <ButtonGroup size="small">
              <Button
                onClick={() => setSelectedSplitType("percentage")}
                variant={
                  selectedSplitType === "percentage" ? "contained" : "outlined"
                }
              >
                Percentage
              </Button>
              <Button
                onClick={() => setSelectedSplitType("value")}
                variant={
                  selectedSplitType === "value" ? "contained" : "outlined"
                }
              >
                Value
              </Button>
            </ButtonGroup>
          </Stack>
          {/* Per‑member inputs */}
          <Stack direction="column" overflow="auto" maxHeight={200}>
            {members.map((member) => (
              <SplitAmountBox
                key={member._id}
                member={member}
                value={split[member._id]}
                onChange={(newVal) =>
                  setSplit((prev) => ({ ...prev, [member._id]: newVal }))
                }
              />
            ))}
          </Stack>
          <Divider sx={{ my: 1 }} />
          {/* Total + validation message */}
          <Stack direction="row" justifyContent="space-between">
            <Typography>
              Total {selectedSplitType === "percentage" ? "(%)" : ""}
            </Typography>
            <Typography color={isValid ? "textPrimary" : "error"}>
              {total}
            </Typography>
          </Stack>
          {!isValid && (
            <Typography color="error" variant="caption">
              {selectedSplitType === "percentage"
                ? "Percentages must add up to 100%"
                : `Values must add up to ${numericAmount}`}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          loading={isLoading || editLoading}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default GroupExpenseForm;
