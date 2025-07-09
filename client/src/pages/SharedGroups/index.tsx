import React from "react";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CreateGroupDialog from "./CreateGroupDialog";

const SharedGroups: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Stack direction="row" flexGrow={1}>
      <Box sx={{ width: "500px" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          p={1}
        >
          <Typography variant="h5">Shared Groups</Typography>
          <IconButton onClick={handleOpen}>
            <AddBoxIcon />
          </IconButton>
        </Stack>
        {/* <SharedGroupList /> */}
      </Box>
      <Divider />
      <Stack flexGrow={1} sx={{ bgcolor: "yellow" }} p={2}>
        {/* <SharedGroupDetails /> */}
      </Stack>
      <CreateGroupDialog open={open} handleClose={handleClose} />
    </Stack>
  );
};

export default SharedGroups;
