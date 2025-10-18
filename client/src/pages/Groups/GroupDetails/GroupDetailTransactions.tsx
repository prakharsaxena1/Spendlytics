import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import TransactionCard from "./TransactionCard";
import { GroupTransactionApis } from "../../../redux/services/group";
import { useParams } from "react-router-dom";
import Loader from "../../../components/common/Loader";

const GroupDetailTransactions: React.FC = () => {
  const { id } = useParams();
  // Use the query hook directly instead of lazy query
  const {
    data: groupTransactions,
    isLoading,
    isFetching,
    error,
  } = GroupTransactionApis.useGetGroupTransactionsQuery(id!, { skip: !id });

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (error) {
    return (
      <Stack flexGrow={1} alignItems="center" justifyContent="center">
        <Typography color="error">Failed to load transactions</Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ p: 1, overflowY: "auto" }}>
      {groupTransactions?.transactions.map((tx) => (
        <TransactionCard key={tx._id} tx={tx} />
      ))}
    </Box>
  );
};
export default GroupDetailTransactions;
