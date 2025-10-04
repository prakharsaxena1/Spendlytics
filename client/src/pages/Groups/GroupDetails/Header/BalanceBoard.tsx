import React, { useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useGroupContext } from "../../GroupContext";
import { BalanceBoardApis } from "../../../../redux/services/group";

const BalanceBoard: React.FC = () => {
  const { group, membersMap } = useGroupContext();
  const [trigger, { data, error, isLoading }] =
    BalanceBoardApis.useLazyCalculateBalanceBoardQuery();

  useEffect(() => {
    if (group?._id) {
      trigger(group._id);
    }
  }, [group?._id, trigger]);

  if (isLoading) {
    return (
      <Box sx={{ minWidth: 700 }}>
        <Typography>Calculating...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ minWidth: 700 }}>
        <Typography>Failed to calculate</Typography>
      </Box>
    );
  }

  const paymentMembers = Object.keys(data?.payments ?? {});
  return (
    <Box sx={{ minWidth: 700, px: 1, pb: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell align="right">
                <strong>You are owed</strong>
              </TableCell>
              <TableCell align="right">
                <strong>You owe</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentMembers.map((memberId) => {
              const value = data?.payments?.[memberId] ?? 0;
              const owed =
                value > 0 ? `Rs. ${Math.abs(value).toFixed(2)}` : "-";
              const owe = value < 0 ? `Rs. ${Math.abs(value).toFixed(2)}` : "-";
              return (
                <TableRow key={memberId}>
                  <TableCell>{membersMap[memberId].firstname}</TableCell>
                  <TableCell align="right">{owed}</TableCell>
                  <TableCell align="right">{owe}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BalanceBoard;
