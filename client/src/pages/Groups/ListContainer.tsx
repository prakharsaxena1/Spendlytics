import React, { useEffect } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListItem from "./ListItem";
import CreateGroupDialog from "./CreateGroupDialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { GroupApis } from "../../redux/services/group";

const ListContainer = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [getAllGroupsTrigger, { data: allGroups }] =
    GroupApis.useLazyGetAllGroupsQuery();

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
          <Typography variant="h5">Groups</Typography>
          <IconButton onClick={handleOpen}>
            <AddBoxIcon />
          </IconButton>
        </Stack>
        <Divider orientation="horizontal" flexItem />
        <Stack direction="column" flexGrow={1} overflow="auto">
          {allGroups?.groups.map((item) => (
            <ListItem key={item._id} groupDetails={item} />
          ))}
        </Stack>
      </Stack>
      <CreateGroupDialog open={open} handleClose={handleClose} />
    </>
  );
};

export default ListContainer;
