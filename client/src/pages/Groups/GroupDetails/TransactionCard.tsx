import React, { useMemo, useState } from "react";
import {
  Card,
  Typography,
  Box,
  Chip,
  Stack,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import { getFormattedDate } from "../../../utils/helper";
import { useAppSelector } from "../../../redux/hooks";
import { CurrentUserSelector } from "../../../redux/slices/auth/selector";
import {
  GroupTransactionApis,
  type GetGroupTransactionsResponse,
} from "../../../redux/services/group";
import type { MemberType } from "../../../redux/services/user";
import { useGroupContext } from "../GroupContext";
import FormSlideupDialog from "../../../components/common/FormSlideupDialog";
import GroupExpenseForm from "./GroupExpenseForm";
import SlideupDialog from "../../../components/common/SlideupDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type TransactionCardProps = {
  tx: GetGroupTransactionsResponse["transactions"][number];
  memberMap: Record<string, MemberType>;
};

const formatUser = (username: string, amt: string) => `@${username}: ${amt}`;

const TransactionCard: React.FC<TransactionCardProps> = ({ tx, memberMap }) => {
  const user = useAppSelector(CurrentUserSelector);
  const { group, transaction } = useGroupContext();

  const [deleteTrigger, { isLoading }] =
    GroupTransactionApis.useDeleteGroupTransactionMutation();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setEditDeleteDialog] = useState(false);

  const isTxYours = useMemo(
    () => tx.userId === user?._id,
    [tx.userId, user?._id]
  );

  const { setTransaction } = useGroupContext();

  const handleOpenGroupTransactionDialog = () => {
    setEditDeleteDialog(true);
    setTransaction(tx);
  };

  const handleCloseGroupTransactionDialog = () => {
    setEditDeleteDialog(false);
    setTransaction(null);
  };

  const handleDeleteTransaction = () => {
    deleteTrigger({ groupId: tx.group, transactionId: tx._id });
    setOpenDeleteDialog(false);
  };

  const grpCreator = group?.createdBy;
  const canModify = isTxYours || grpCreator === user?._id;

  return (
    <>
      <Card sx={{ mb: 1, ml: isTxYours ? "auto" : 0, width: 450 }}>
        <Stack
          p={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontWeight={700}>
            Amount: ₹{tx.amount.toLocaleString()}
          </Typography>
          {canModify && (
            <Stack
              spacing={1}
              direction="row"
              sx={{
                opacity: 0,
                transition: "opacity 0.2s",
                pointerEvents: "none",
                ".MuiCard-root:hover &": {
                  opacity: 1,
                  pointerEvents: "auto",
                },
              }}
            >
              <IconButton
                size="small"
                onClick={
                  isLoading ? undefined : handleOpenGroupTransactionDialog
                }
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={
                  isLoading ? undefined : () => setOpenDeleteDialog(true)
                }
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>
        <Box p={1}>
          <Stack direction="row" flexWrap="wrap" gap={0.5}>
            {Object.entries(tx.splitDetails).map(([userId, percent]) => (
              <Chip
                key={userId}
                size="small"
                label={
                  <Typography variant="subtitle2">
                    {formatUser(
                      memberMap[userId]?.username ?? "",
                      tx.splitType === "percentage"
                        ? `${percent}%`
                        : `₹${percent}`
                    )}
                  </Typography>
                }
                variant="outlined"
              />
            ))}
          </Stack>
          <Typography variant="h6">{tx.note}</Typography>
          <Typography variant="caption">
            Last modified: {getFormattedDate(tx.transactionDate)}
          </Typography>
        </Box>
      </Card>
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
        handleClose={() => setOpenDeleteDialog(false)}
      >
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">
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
      <FormSlideupDialog
        open={openEditDialog}
        handleClose={handleCloseGroupTransactionDialog}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <EditIcon />
            <Typography variant="h5">Edit group expense</Typography>
          </Stack>
        }
        content={
          <GroupExpenseForm
            handleClose={handleCloseGroupTransactionDialog}
            members={group?.members ?? []}
            transaction={transaction ?? undefined}
          />
        }
      />
    </>
  );
};

export default TransactionCard;
