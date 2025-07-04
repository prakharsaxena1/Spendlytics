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
import PieChart from "@mui/icons-material/PieChart";
import GroupsIcon from "@mui/icons-material/Groups";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import UserDetailsBox from "./UserDetailsBox";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/auth/slice";
import { AuthApis } from "../../redux/services/auth";
import { changeTheme } from "../../redux/slices/appConfig/slice";
import { IconButton, styled } from "@mui/material";

const DRAWER_WIDTH = 220;
const COLLAPSED_WIDTH = 56;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    bgcolor: "#F2F7FF",
  },
}));

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutTrigger] = AuthApis.useLogoutMutation();

  const [collapsed, setCollapsed] = React.useState(false);
  const [logutDialogOpen, setLogutDialogOpen] = React.useState(false);

  const handleLogutDialogOpen = () => {
    setLogutDialogOpen(true);
  };

  const handleLogutDialogClose = () => {
    setLogutDialogOpen(false);
  };
  const handleToggle = () => setCollapsed((prev) => !prev);

  const handleUserLogout = () => {
    logoutTrigger(null)
      .unwrap()
      .then(() => {
        dispatch(logout());
        dispatch(changeTheme("light"));
        navigate("/");
      });
  };

  return (
    <StyledDrawer variant="permanent" anchor="left" collapsed={collapsed}>
      {/* collapse/expand toggle */}
      <IconButton
        onClick={handleToggle}
        sx={{
          m: 1,
          alignSelf: collapsed ? "center" : "flex-end",
        }}
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
      <Brand hide={collapsed} />
      <List sx={{ flexGrow: 1 }}>
        <NavItem
          path="dashboard"
          icon={<DashboardIcon />}
          navName="Dashboard"
          isCollapsed={collapsed}
        />
        <NavItem
          path="transactions"
          icon={<PaidIcon />}
          navName="Transactions"
          isCollapsed={collapsed}
        />
        <NavItem
          path="shared-groups"
          icon={<GroupsIcon />}
          navName="Shared Groups"
          isCollapsed={collapsed}
        />
        <NavItem
          path="money-plans"
          icon={<PieChart />}
          navName="Money Plans"
          isCollapsed={collapsed}
        />
        <NavItem
          path="account"
          icon={<PersonIcon />}
          navName="Account"
          isCollapsed={collapsed}
        />
        <NavItem
          path="settings"
          icon={<Settings />}
          navName="Settings"
          isCollapsed={collapsed}
        />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogutDialogOpen}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Logout />
              <Typography fontWeight={600}>
                {collapsed ? "" : "Logout"}
              </Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
      </List>
      <UserDetailsBox isCollapsed={collapsed} />

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
    </StyledDrawer>
  );
};

export default Sidebar;
