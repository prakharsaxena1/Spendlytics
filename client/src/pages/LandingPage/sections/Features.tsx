import React, { forwardRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PieChartIcon from "@mui/icons-material/PieChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import ColorLensIcon from "@mui/icons-material/ColorLens";

const features = [
  {
    icon: <DashboardIcon fontSize="large" />,
    title: "Personal Dashboard",
    description:
      "Get a clear overview of income, expenses, savings, and budgets — all customizable.",
  },
  {
    icon: <SearchIcon fontSize="large" />,
    title: "Advanced Search & Filters",
    description: "Quickly find transactions by date, category, or amount.",
  },
  {
    icon: <AccountBalanceWalletIcon fontSize="large" />,
    title: "Track Income & Expenses",
    description:
      "Categorize transactions to understand exactly where your money goes.",
  },
  {
    icon: <PieChartIcon fontSize="large" />,
    title: "Budgeting & Goals",
    description:
      "Set monthly/weekly budgets and saving goals, then track progress visually.",
  },
  {
    icon: <GroupIcon fontSize="large" />,
    title: "Expense Sharing",
    description:
      "Split bills with friends and track group expenses for trips or events.",
  },
  {
    icon: <ColorLensIcon fontSize="large" />,
    title: "Themes & Personalization",
    description:
      "Choose light, dark, or custom themes and add personal notes to transactions.",
  },
];

const Features: React.ForwardRefExoticComponent<React.RefAttributes<unknown>> =
  forwardRef<unknown>((_props, ref) => {
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
        <Stack spacing={4} alignItems="center">
          <Typography variant="h3" fontWeight="bold" textAlign="center">
            Powerful Features to Take Control of Your Finances
          </Typography>
          <Stack direction="row" gap={2} flexWrap="wrap" maxWidth={1200}>
            {features.map((feature) => (
              <Paper
                key={feature.title}
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
                {feature.icon}
                <Typography variant="h6" mt={2} mb={1} fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography variant="body2">{feature.description}</Typography>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Box>
    );
  });

export default Features;
