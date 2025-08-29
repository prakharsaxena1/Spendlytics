import React, { forwardRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const steps = [
  {
    icon: <PlaylistAddCheckIcon fontSize="large" />,
    title: "1. Add Your Transactions",
    description:
      "Log your income and expenses with categories for instant organization.",
  },
  {
    icon: <ShowChartIcon fontSize="large" />,
    title: "2. Track & Analyze",
    description:
      "See spending patterns, set budgets, and monitor progress toward savings goals.",
  },
  {
    icon: <GroupAddIcon fontSize="large" />,
    title: "3. Share & Collaborate",
    description:
      "Split bills, manage group expenses, and keep everyone on the same page.",
  },
];

const Howitworks: React.ForwardRefExoticComponent<
  React.RefAttributes<unknown>
> = forwardRef<unknown>((_props, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        minHeight: "100lvh",
        py: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={4} alignItems="center" textAlign="center">
        <Typography variant="h3" fontWeight="bold">
          How It Works
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, opacity: 0.85 }}>
          Get started in minutes — manage your finances with clarity and ease
        </Typography>
        <Stack direction="row" gap={2} flexWrap="wrap" maxWidth={1200}>
          {steps.map((step) => (
            <Paper
              key={step.title}
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                minWidth: 300,
              }}
            >
              {step.icon}
              <Typography variant="h6" mt={2} mb={1} fontWeight="bold">
                {step.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {step.description}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
});

export default Howitworks;
