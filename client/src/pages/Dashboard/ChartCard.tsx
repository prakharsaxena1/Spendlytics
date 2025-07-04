import { Paper, Typography } from "@mui/material";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

type ChartCardProps = {
  data: {
    name: string;
    needs: number;
    wants: number;
    investments: number;
    needs_ideal: number;
    wants_ideal: number;
    investments_ideal: number;
    savings: number;
  }[];
  dataKey: string;
  color: string;
  idealKey: string;
  title: string;
};

const ChartCard: React.FC<ChartCardProps> = ({
  data,
  dataKey,
  color,
  idealKey,
  title,
}) => (
  <Paper sx={{ p: 2, flex: 1 }} elevation={3}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#555" }}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis width={40} tickFormatter={(value) => `₹${value / 1000}k`} />
        <Tooltip
          formatter={(value) => [`₹${value}`, "Amount"]}
          labelFormatter={(value) => `Month: ${value}`}
        />
        <Legend />
        <Line
          name="Actual"
          dataKey={dataKey}
          strokeWidth={3}
          stroke={color}
          dot={{ r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
        <Line
          name="Ideal"
          dataKey={idealKey}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          opacity={0.7}
        />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);

export default ChartCard;
