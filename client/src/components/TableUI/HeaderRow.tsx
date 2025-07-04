import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import {
  flexRender,
  type Column,
  type Header,
  type SortingState,
} from "@tanstack/react-table";
import type { TransactionItemType } from "../../redux/services/transaction/types";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type HeaderRowProps = {
  headers: Header<TransactionItemType, unknown>[];
  sorting: SortingState;
};

function Filter({ column }: { column: Column<TransactionItemType, unknown> }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column]
  );

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box>
          <List dense>
            <ListItemButton
              selected={columnFilterValue === undefined}
              onClick={() => {
                column.setFilterValue(undefined);
                handleClose();
              }}
            >
              <ListItemText primary="All" />
            </ListItemButton>
            {sortedUniqueValues.map((value) => (
              <ListItemButton
                key={value}
                selected={columnFilterValue === value}
                onClick={() => {
                  column.setFilterValue(value);
                  handleClose();
                }}
              >
                <ListItemText primary={value} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
}

const HeaderRow: React.FC<HeaderRowProps> = ({ headers, sorting }) => {
  return (
    <TableRow>
      {headers.map(({ column, id, getContext }) => (
        <TableCell
          key={id}
          sx={{
            userSelect: "none",
            fontWeight: 700,
            bgcolor: "primary.main",
            color: "#ECF0F1",
            cursor: column.getCanSort() ? "pointer" : "default",
            width: column.getSize(),
            p: 0,
            ...(column.getCanSort() && {
              "&:hover": {
                bgcolor: "#ECF0F1",
                color: "primary.main",
              },
            }),
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Box
              onClick={column.getToggleSortingHandler()}
              sx={{ p: "6px 16px", flexGrow: 1 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                {flexRender(column.columnDef.header, getContext())}
                {sorting?.[0]?.id !== id ? null : sorting[0].desc ? (
                  <ArrowDownwardIcon fontSize="small" />
                ) : (
                  <ArrowUpwardIcon fontSize="small" />
                )}
              </Stack>
            </Box>
            <Box>
              {column.getCanFilter() ? <Filter column={column} /> : null}
            </Box>
          </Stack>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default HeaderRow;
