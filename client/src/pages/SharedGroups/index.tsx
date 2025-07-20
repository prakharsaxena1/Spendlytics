import React from "react";
import { Divider, Stack } from "@mui/material";
import SGListContainer from "./SGListContainer";
import SGDetails from "./SGDetails";

const SharedGroups: React.FC = () => {
  return (
    <Stack direction="row" flexGrow={1} overflow="hidden">
      <SGListContainer />
      <Divider orientation="vertical" />
      <SGDetails />
    </Stack>
  );
};

export default SharedGroups;
