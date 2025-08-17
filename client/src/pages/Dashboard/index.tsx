import React, { useState } from "react";
import { Button, Grid, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import ChartCard from "./ChartCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

const generateData = () => {
  const months = [
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

const Dashboard: React.FC = () => {
  const [chartData] = useState(generateData());
  const [transactionFromDate, setTransactionFromDate] = useState<Dayjs | null>(
    null
  );
  const [transactionToDate, setTransactionToDate] = useState<Dayjs | null>(
    null
  );

  return (
    <Box sx={{ flexGrow: 1, p: 1.5, overflow: "auto" }}>
      <Grid container mb={2} spacing={1}>
        <Grid size={{ xs: 12 }}>
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
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
