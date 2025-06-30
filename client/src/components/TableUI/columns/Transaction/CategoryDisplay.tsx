import React from "react";
import { Chip, Typography } from "@mui/material";
import type { TransactionItemType } from "../../../../redux/services/transaction/types";

type CategoryDisplayProps = {
  categoryType: TransactionItemType["category"];
};

const keyColorMap = {
  savings: "#4CAF50",
  debt: "#F44336",
  investments: "#2196F3",
  needs: "#FF9800",
  wants: "#9C27B0",
};

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ categoryType }) => {
  const color = keyColorMap[categoryType] ?? "#607D8B";
  return (
    <Chip
      label={<Typography variant="body2">{categoryType}</Typography>}
      sx={{ color, borderColor: color }}
      size="small"
      variant="outlined"
    />
  );
};

export default CategoryDisplay;
