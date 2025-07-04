import React, { useState, useMemo } from "react";
import {
  Button,
  capitalize,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  AccountBalance,
  Group,
  PieChart,
  TrendingUp,
} from "@mui/icons-material";
import ChartCard from "./ChartCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

const GridItemCard: React.FC<{ children: React.JSX.Element }> = ({
  children,
}) => {
  return (
    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
      <Box component={Paper} elevation={3} height="100%">
        {children}
      </Box>
    </Grid>
  );
};

// Improved data structure
const generateData = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  return months.map((month) => ({
    name: month,
    needs: Math.floor(Math.random() * 12000) + 8000,
    wants: Math.floor(Math.random() * 6000) + 2000,
    investments: Math.floor(Math.random() * 20000) + 10000,
    needs_ideal: 10000,
    wants_ideal: 5000,
    investments_ideal: 15000,
    savings: Math.floor(Math.random() * 20000) + 10000,
  }));
};
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentMonthName = monthNames[new Date().getMonth()];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  // Generate dynamic data
  const [chartData] = useState(generateData());
  const [transactionFromDate, setTransactionFromDate] = useState<Dayjs | null>(
    null
  );
  const [transactionToDate, setTransactionToDate] = useState<Dayjs | null>(
    null
  );

  const financialData = useMemo(
    () => ({
      currentBalance: 12500.75,
      startingBalance: 10000.0,
      netPosition: 3500.25,
      availableToBudget: 2500.5,
      budgetStatus: 85,
      groupFinances: {
        owedToYou: 1250.75,
        youOwe: 580.5,
      },
      userProgression: {
        level: 4,
        points: 850,
        pointsToNextLevel: 150,
      },
    }),
    []
  );

  const level = financialData.userProgression.level;
  const points = financialData.userProgression.points;
  const pointsToNextLevel = financialData.userProgression.pointsToNextLevel;
  const progress = (points / (points + pointsToNextLevel)) * 100;

  return (
    <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
      <Grid container mb={2} spacing={1}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Dashboard
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <DatePicker
                  label="From (DD/MM/YYYY)"
                  value={transactionFromDate}
                  onChange={(value) => setTransactionFromDate(value)}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                  format="DD/MM/YYYY"
                />
              </Box>
              <Box>
                <DatePicker
                  label="To (DD/MM/YYYY)"
                  value={transactionToDate}
                  onChange={(value) => setTransactionToDate(value)}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                  format="DD/MM/YYYY"
                />
              </Box>
              <Button variant="contained">Apply</Button>
            </Stack>
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Stack direction="column" spacing={2} flex={2}>
        <Grid container spacing={2}>
          <GridItemCard>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" mb={1} spacing={1}>
                <AccountBalance sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" color="textSecondary">
                  Current Balance
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                ₹
                {financialData.currentBalance.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </GridItemCard>
          <GridItemCard>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" mb={1} spacing={1}>
                <Group />
                <Typography variant="h6" color="textSecondary">
                  Shared Group
                </Typography>
              </Stack>
              <Stack direction="column">
                <Typography variant="subtitle2" color="error">
                  You owe: Rs.{financialData.groupFinances.youOwe}
                </Typography>
                <Typography variant="subtitle2" color="success">
                  You are owed: Rs.{financialData.groupFinances.owedToYou}
                </Typography>
              </Stack>
            </Box>
          </GridItemCard>
          <GridItemCard>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" mb={1} spacing={1}>
                <PieChart sx={{ color: theme.palette.warning.main }} />
                <Typography variant="h6">Budget Compliance</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">
                  {capitalize(currentMonthName)}'s budget
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  Rs. 9313
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">Roll over budget</Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  Rs. 300
                </Typography>
              </Stack>
            </Box>
          </GridItemCard>
          <GridItemCard>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" mb={1} spacing={1}>
                <TrendingUp sx={{ color: theme.palette.success.main }} />
                <Typography variant="h6">Your Progress</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="subtitle1">Level {level}</Typography>
                <Typography variant="subtitle1">
                  {points}/{points + pointsToNextLevel} points
                </Typography>
              </Stack>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          </GridItemCard>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard
              data={chartData}
              dataKey="investments"
              idealKey="investments_ideal"
              color="#2196F3"
              title="Investments"
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard
              data={chartData}
              dataKey="savings"
              idealKey="savings"
              color="#4CAF50"
              title="Savings"
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard
              data={chartData}
              dataKey="needs"
              idealKey="needs_ideal"
              color="#FF9800"
              title="Needs"
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard
              data={chartData}
              dataKey="wants"
              idealKey="wants_ideal"
              color="#9C27B0"
              title="Wants"
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default Dashboard;
