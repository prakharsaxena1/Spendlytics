import React, { useEffect } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SGListItem from "./SGListItem";
import CreateGroupDialog from "./CreateGroupDialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SharedGroupApis } from "../../redux/services/sharedgroup";

const SGListContainer = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [getAllGroupsTrigger, { data: allGroups }] =
    SharedGroupApis.useLazyGetAllSharedGroupQuery();

  useEffect(() => {
    getAllGroupsTrigger();
  }, [getAllGroupsTrigger]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Stack
        sx={{ maxWidth: "25%", minWidth: "400px", overflow: "hidden" }}
        flexGrow={1}
      >
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
        <Divider orientation="horizontal" flexItem />
        <Stack direction="column" flexGrow={1} overflow="auto">
          {allGroups?.sharedGroups.map((item) => (
            <SGListItem key={item._id} sharedGroupDetails={item} />
          ))}
        </Stack>
      </Stack>
      <CreateGroupDialog open={open} handleClose={handleClose} />
    </>
  );
};

export default SGListContainer;
