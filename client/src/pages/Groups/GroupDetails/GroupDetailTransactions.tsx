import React, { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import TransactionCard from "./TransactionCard";
import { GroupTransactionApis } from "../../../redux/services/group";
import { useParams } from "react-router-dom";
import type { MemberType } from "../../../redux/services/user";
import { useGroupContext } from "../GroupContext";
import Loader from "../../../components/common/Loader";

const GroupDetailTransactions: React.FC = () => {
  const { id } = useParams();
  const { group } = useGroupContext();

  // Use the query hook directly instead of lazy query
  const {
    data: groupTransactions,
    isLoading,
    isFetching,
    error,
  } = GroupTransactionApis.useGetGroupTransactionsQuery(id!, { skip: !id });

  const memberMap = useMemo(() => {
    if (!group?.members) return {};
    return group.members.reduce((obj, m) => {
      obj[m._id] = m;
      return obj;
    }, {} as Record<string, MemberType>);
  }, [group?.members]);

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
        <TransactionCard key={tx._id} tx={tx} memberMap={memberMap} />
      ))}
    </Box>
  );
};
export default GroupDetailTransactions;
