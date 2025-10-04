import React, { useMemo } from "react";
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
import { UserApis } from "../../redux/services/user";
import Loader from "../../components/common/Loader";
import type { TransactionItemType } from "../../redux/services/transaction/types";

// Colors for the categories
const COLORS = ["#4CAF50", "#FF9800", "#9C27B0", "#2196F3"];
const CATEGORIES: TransactionItemType["category"][] = ["savings", "needs", "wants", "investments"];

const BudgetAllocationDashboard: React.FC = () => {
  const { data, isLoading } = UserApis.useDashboardQuery();
  const piedata = useMemo(() => {
    if (data?.totalPercentage) {
      return CATEGORIES.map((item) => ({
        name: item,
        value: data.totalPercentage[item] ?? -1,
      }));
    }
    return [];
  }, [data?.totalPercentage]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="column" gap={4}>
        <Stack direction="row" gap={2} justifyContent="center" flexWrap="wrap">
          {CATEGORIES.map((category, index) => (
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
                  {capitalize(category)}
                </Typography>
                <Typography variant="h5">
                  Rs. {data?.totalByCategory?.[category] ?? "asd"}
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
                  data={data?.monthDetails}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  {CATEGORIES.map((cat, idx) => (
                    <Line
                      key={cat}
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
                    data={piedata}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent! * 100).toFixed(0)}%`
                    }
                  >
                    {CATEGORIES.map((_entry, index) => (
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
