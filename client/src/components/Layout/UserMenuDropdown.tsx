import React from "react";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { grey } from "@mui/material/colors";
import { capitalize } from "@mui/material";
import { AuthApis } from "../../redux/services/auth";
import { CurrentUserSelector } from "../../redux/slices/auth/selector";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/auth/slice";
import { changeTheme } from "../../redux/slices/appConfig/slice";
import SlideupDialog from "../common/SlideupDialog";

type UserMenuDropdownProps = {
  anchorEl: null | HTMLElement;
  handleCloseMenu: () => void;
};

const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({
  anchorEl,
  handleCloseMenu,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(CurrentUserSelector);

  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const [logoutTrigger] = AuthApis.useLogoutMutation();

  const handleLogoutDialogOpen = () => {
    handleCloseMenu();
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  const handleUserLogout = () => {
    logoutTrigger(null)
      .unwrap()
      .then(() => {
        dispatch(logout());
        dispatch(changeTheme("light"));
        navigate("/");
      });
  };

  const navTo = (path: string) => {
    handleCloseMenu();
    navigate(path);
  };

  if (user === null) {
    return null;
  }

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
        slotProps={{
          list: {
            sx: {
              paddingTop: 0,
            },
          },
        }}
      >
        <Box sx={{ width: 240, p: 0 }}>
          <Box sx={{ p: 1 }}>
            <Stack direction="column" alignItems="center">
              <Typography variant="body1">
                {capitalize(user.firstname)} {capitalize(user.lastname)}
              </Typography>
              <Typography variant="body2">Level {user.level}</Typography>
            </Stack>
          </Box>
          <MenuList>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navTo("settings")}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Settings />
                  <Typography fontWeight={600}>Settings</Typography>
                </Stack>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navTo("account")}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon />
                  <Typography fontWeight={600}>Account</Typography>
                </Stack>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogoutDialogOpen}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Logout />
                  <Typography fontWeight={600}>Logout</Typography>
                </Stack>
              </ListItemButton>
            </ListItem>
          </MenuList>
        </Box>
      </Menu>
      <SlideupDialog
        title="Logout"
        message="Are you sure you want to logout?"
        open={logoutDialogOpen}
        handleClose={handleLogoutDialogClose}
      >
        <DialogActions>
          <Button color="inherit" onClick={handleLogoutDialogClose}>
            No
          </Button>
          <Button color="inherit" onClick={handleUserLogout}>
            Yes
          </Button>
        </DialogActions>
      </SlideupDialog>
    </>
  );
};

export default UserMenuDropdown;
