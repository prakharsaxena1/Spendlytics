import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import NavItem from "./NavItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaidIcon from "@mui/icons-material/Paid";
import PieChart from "@mui/icons-material/PieChart";
import GroupsIcon from "@mui/icons-material/Groups";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
  willChange: "auto",
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    bgcolor: "#F2F7FF",
    position: "relative", // Add this
    zIndex: 1100,
  },
}));

const Sidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const handleToggle = () => setCollapsed((prev) => !prev);
  return (
    <StyledDrawer variant="permanent" collapsed={collapsed}>
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
          path="friends"
          icon={<GroupsIcon />}
          navName="Friends"
          isCollapsed={collapsed}
        />
      </List>
      <IconButton
        onClick={handleToggle}
        sx={{
          m: 1,
          alignSelf: collapsed ? "center" : "flex-end",
        }}
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </StyledDrawer>
  );
};

export default Sidebar;
