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
import SlideupDialog from "../../../components/common/SlideupDialog";
import { Button, DialogActions, Stack, Typography } from "@mui/material";
import FormInput from "../../../components/common/FormInput";

type SGOptionsProps = {
  anchorEl: null | HTMLElement;
  handleCloseMenu: () => void;
};

const SGOptions: React.FC<SGOptionsProps> = ({ anchorEl, handleCloseMenu }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changeNameDialogOpen, setChangeNameDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState(false);

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
    if (name.trim() === "") {
      setErrorName(true);
    } else {
      // After api call
      setErrorName(false);
      setName("");
      handleCloseChangeNameDialog();
    }
  };

  // Delete
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  const handleDeleteGroup = () => {
    handleOpenDeleteDialog();
    handleCloseMenu();
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
            <MenuItem onClick={handleDeleteGroup}>
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
          <Button color="inherit" onClick={handleOpenDeleteDialog}>
            Yes
          </Button>
        </DialogActions>
      </SlideupDialog>
    </>
  );
};

export default SGOptions;
