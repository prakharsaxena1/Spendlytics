import React, { forwardRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Howitworks: React.ForwardRefExoticComponent<
  React.RefAttributes<unknown>
> = forwardRef((_props, ref) => {
  return (
    <Box ref={ref} sx={{ height: "100lvh", bgcolor: "#074a73" }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        direction="row"
        height="100%"
      >
        <Typography>How it works</Typography>
      </Stack>
    </Box>
  );
});

export default Howitworks;
