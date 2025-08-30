import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Paper,
  Grid,
  capitalize,
} from "@mui/material";

// Define TypeScript interfaces
interface MonthlyData {
  month: string;
  savings: number;
  needs: number;
  wants: number;
  investments: number;
}

interface PieData {
  name: string;
  value: number;
}

// Generate sample data for 12 months
const generateData = (): MonthlyData[] => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, index) => {
    // Base values with some seasonal variation
    const baseNeeds = 2000 + Math.sin(index) * 200;
    const baseWants = 800 + Math.cos(index) * 100;
    const baseSavings = 600 + Math.sin(index + 2) * 100;
    const baseInvestments = 700 + Math.cos(index + 1) * 150;

    // Add some randomness
    const randomFactor = () => 0.8 + Math.random() * 0.4;

    return {
      month,
      needs: Math.round(baseNeeds * randomFactor()),
      wants: Math.round(baseWants * randomFactor()),
      savings: Math.round(baseSavings * randomFactor()),
      investments: Math.round(baseInvestments * randomFactor()),
    };
  });
};

// Colors for the categories
const COLORS = ["#4CAF50", "#FF9800", "#9C27B0", "#2196F3"];
const CATEGORIES = ["savings", "needs", "wants", "investments"];

const BudgetAllocationDashboard: React.FC = () => {
  const [data] = useState<MonthlyData[]>(generateData());

  // Calculate totals for pie chart
  const pieData: PieData[] = CATEGORIES.map((category) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: data.reduce(
      (sum, entry) => sum + (entry[category as keyof MonthlyData] as number),
      0
    ),
  }));

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="column" gap={4}>
        <Stack direction="row" gap={2} justifyContent="center" flexWrap="wrap">
          {pieData.map((category, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                minWidth: 200,
                borderLeft: `4px solid ${COLORS[index]}`,
              }}
            >
              <CardContent>
                <Typography fontWeight={700} color={COLORS[index]}>
                  {category.name}
                </Typography>
                <Typography variant="h5">
                  ${category.value.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <Box sx={{ height: 400, minWidth: "40%" }} component={Paper}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  {CATEGORIES.map((cat, idx) => (
                    <Line
                      type="monotone"
                      dataKey={cat}
                      stroke={COLORS[idx]}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                  <Legend formatter={(value) => capitalize(value)} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
            <Box sx={{ height: 400, minWidth: "40%" }} component={Paper}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent! * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default BudgetAllocationDashboard;
