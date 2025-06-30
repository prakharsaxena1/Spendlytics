import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Popover,
} from "@mui/material";
import type { Table } from "@tanstack/react-table";

type ColumnsToggleProps<T> = {
  open: boolean;
  onClose: () => void;
  table: Table<T>;
  anchorEl: HTMLButtonElement | null;
};

const ColumnsToggle = <T,>({
  open,
  onClose,
  table,
  anchorEl,
}: ColumnsToggleProps<T>) => {
  const cols = table.getAllLeafColumns();
  return (
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
              label={column.columnDef.header as string}
            />
          ))}
        </FormGroup>
      </Box>
    </Popover>
  );
};

export default ColumnsToggle;
