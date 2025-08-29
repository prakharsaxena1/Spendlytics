import React from "react";
import { Divider, Stack } from "@mui/material";
import ListContainer from "./ListContainer";
import { GroupProvider } from "./GroupContext";
import GroupHeader from "./GroupDetails/GroupHeader";
import GroupDetailTransactions from "./GroupDetails/GroupDetailTransactions";

const Groups: React.FC = () => {
  return (
    <Stack direction="row" flexGrow={1} overflow="hidden">
      <ListContainer />
      <Divider orientation="vertical" />
      <GroupProvider>
        <Stack flexGrow={1}>
          <GroupHeader />
          <Divider />
          <GroupDetailTransactions />
        </Stack>
      </GroupProvider>
    </Stack>
  );
};

export default Groups;
