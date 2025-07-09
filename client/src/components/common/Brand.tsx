import React from "react";
import { Stack, Typography } from "@mui/material";

const Brand: React.FC = () => (
  <div draggable>
    <Stack p={1} direction="row" justifyContent="center">
      <Typography variant="h5" letterSpacing={1.1}>
        Spend
      </Typography>
      <Typography variant="h5" fontWeight={700} letterSpacing={1.1}>
        lytics
      </Typography>
    </Stack>
  </div>
);

export default Brand;
