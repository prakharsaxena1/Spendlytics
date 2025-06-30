import React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Brand from "../common/Brand";
import NavItem from "./NavItem";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SlideupDialog from "../common/SlideupDialog";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaidIcon from "@mui/icons-material/Paid";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import { useNavigate } from "react-router-dom";
import UserDetailsBox from "./UserDetailsBox";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/auth/slice";
import { AuthApis } from "../../redux/services/auth";
import { changeTheme } from "../../redux/slices/appConfig/slice";

const Sidebar = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [logutDialogOpen, setLogutDialogOpen] = React.useState(false);
  const [logoutTrigger] = AuthApis.useLogoutMutation()

  const handleLogutDialogOpen = () => {
    setLogutDialogOpen(true);
  };

  const handleLogutDialogClose = () => {
    setLogutDialogOpen(false);
  };

  const handleUserLogout = () => {
    logoutTrigger(null).unwrap().then(() => {
      dispatch(logout())
      dispatch(changeTheme('light'))
      navigate("/");
    })
  };

  return (
    <Drawer
      sx={{
        width: 220,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Brand />
      <List sx={{ flexGrow: 1 }}>
        <NavItem
          path="dashboard"
          icon={<DashboardIcon />}
          navName="Dashboard"
        />
        <NavItem
          path="transactions"
          icon={<PaidIcon />}
          navName="Transactions"
        />
        <NavItem
          path="shared-groups"
          icon={<GroupsIcon />}
          navName="Shared Groups"
        />
        <NavItem
          path="money-plans"
          icon={<FlagCircleIcon />}
          navName="Money Plans"
        />
        <NavItem path="account" icon={<PersonIcon />} navName="Account" />
        <NavItem path="settings" icon={<Settings />} navName="Settings" />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogutDialogOpen}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Logout />
              <Typography fontWeight={600}>Logout</Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
      </List>
      <UserDetailsBox />

      <SlideupDialog
        title="Logout"
        message="Are you sure you want to logout?"
        open={logutDialogOpen}
        handleClose={handleLogutDialogClose}
      >
        <DialogActions>
          <Button color="inherit" onClick={handleLogutDialogClose}>
            No
          </Button>
          <Button color="inherit" onClick={handleUserLogout}>
            Yes
          </Button>
        </DialogActions>
      </SlideupDialog>
    </Drawer>
  );
};

export default Sidebar;
