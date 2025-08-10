import React from "react";
import { Divider, Stack } from "@mui/material";
import ListContainer from "./ListContainer";
import GroupDetails from "./GroupDetails";

const Groups: React.FC = () => {
  return (
    <Stack direction="row" flexGrow={1} overflow="hidden">
      <ListContainer />
      <Divider orientation="vertical" />
      <GroupDetails />
    </Stack>
  );
};

export default Groups;
