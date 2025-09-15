import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Popover,
} from "@mui/material";
import type { Column } from "@tanstack/react-table";
import type { TransactionItemType } from "../../redux/services/transaction/types";

type ColumnsToggleProps = {
  open: boolean;
  onClose: () => void;
  cols: Column<TransactionItemType, unknown>[];
  // table: Table<TransactionItemType>;
  anchorEl: HTMLButtonElement | null;
};

const ColumnsToggle: React.FC<ColumnsToggleProps> = ({
  open,
  onClose,
  cols,
  anchorEl,
}) => (
  <Popover
    open={open}
    onClose={onClose}
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
  >
    <Box sx={{ p: 2, width: 300 }}>
      <FormGroup>
        {cols.map((column) => (
          <FormControlLabel
            key={column.id}
            disabled={!column.getCanHide()}
            control={
              <Checkbox
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
            }
            label={column.id}
          />
        ))}
      </FormGroup>
    </Box>
  </Popover>
);

export default ColumnsToggle;
