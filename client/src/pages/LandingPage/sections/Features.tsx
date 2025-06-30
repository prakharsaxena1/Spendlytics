import React, { forwardRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Features: React.ForwardRefExoticComponent<
  React.RefAttributes<unknown>
> = forwardRef((_props, ref) => {
  return (
    <Box ref={ref} sx={{ height: "100lvh", bgcolor: "#006aaa" }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        direction="row"
        height="100%"
      >
        <Typography>Features</Typography>
      </Stack>
    </Box>
  );
});

export default Features;
