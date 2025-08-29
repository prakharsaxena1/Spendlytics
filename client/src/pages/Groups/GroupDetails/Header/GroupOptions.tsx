import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { Button, DialogActions, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { GroupApis } from "../../../../redux/services/group";
import SlideupDialog from "../../../../components/common/SlideupDialog";
import FormInput from "../../../../components/common/FormInput";

type GroupOptionsProps = {
  anchorEl: null | HTMLElement;
  handleCloseMenu: () => void;
};

const GroupOptions: React.FC<GroupOptionsProps> = ({
  anchorEl,
  handleCloseMenu,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changeNameDialogOpen, setChangeNameDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState(false);

  const [deleteTrigger] = GroupApis.useDeleteGroupMutation();
  const [groupNameTrigger] = GroupApis.useUpdateGroupNameMutation();

  // Change name
  const handleOpenChangeNameDialog = () => {
    setChangeNameDialogOpen(true);
  };
  const handleCloseChangeNameDialog = () => {
    setChangeNameDialogOpen(false);
  };
  const handleChangeName = () => {
    handleOpenChangeNameDialog();
    handleCloseMenu();
  };

  const handleChangeNameSubmit = () => {
    if (!id) return;
    if (name.trim() === "") {
      setErrorName(true);
    } else {
      groupNameTrigger({ groupId: id, groupName: name })
        .unwrap()
        .then(() => {
          setErrorName(false);
          setName("");
          handleCloseChangeNameDialog();
        });
      // After api call
    }
  };

  // Delete
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  const handleDeleteGroup = () => {
    if (!id) return;
    deleteTrigger({ groupId: id }).then(() => {
      handleCloseDeleteDialog();
      navigate("/app/groups", { replace: true });
    });
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: 200 }}>
          <MenuList sx={{ p: 0 }}>
            <MenuItem>
              <ListItemIcon>
                <PriceCheckIcon />
              </ListItemIcon>
              <ListItemText>Settle payments</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleChangeName}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText>Change name</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleOpenDeleteDialog}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText>Delete group</ListItemText>
            </MenuItem>
          </MenuList>
        </Box>
      </Menu>
      {/* Change name */}
      <SlideupDialog
        title="Change name"
        message={
          <Box sx={{ p: 1, width: 400 }}>
            <Stack direction="column" spacing={0.5}>
              <FormInput
                label="New group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="The fantastic 4"
                error={errorName}
                helperText={errorName ? "Group name is required" : ""}
              />
            </Stack>
          </Box>
        }
        open={changeNameDialogOpen}
        handleClose={handleCloseChangeNameDialog}
      >
        <Button onClick={handleChangeNameSubmit}>Update name</Button>
      </SlideupDialog>
      {/* Delete */}
      <SlideupDialog
        title="Delete group"
        message={
          <Stack direction="column" spacing={0.5}>
            <Typography>Are you sure you want to delete this group?</Typography>
            <Typography variant="caption">
              This will delete all the group transactions, settlements and
              pending invites
            </Typography>
          </Stack>
        }
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
      >
        <DialogActions>
          <Button color="inherit" onClick={handleCloseDeleteDialog}>
            No
          </Button>
          <Button color="inherit" onClick={handleDeleteGroup}>
            Yes
          </Button>
        </DialogActions>
      </SlideupDialog>
    </>
  );
};

export default GroupOptions;
