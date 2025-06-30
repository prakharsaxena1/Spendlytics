import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useAppSelector } from "../../redux/hooks";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider } from "@mui/material";
import { IsAuthenticatedSelector } from "../../redux/slices/auth/selector";

type DrawerListItemProps = {
  icon: React.JSX.Element;
  label: string;
  action?: () => void;
};

const DrawerListItem: React.FC<DrawerListItemProps> = ({
  icon,
  label,
  action,
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={action}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography>{label}</Typography>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};

type SideDrawerProps = {
  open: boolean;
  handleClose: () => void;
  featuresRef: React.RefObject<HTMLElement | null>;
  howItWorksRef: React.RefObject<HTMLElement | null>;
};

const SideDrawer: React.FC<SideDrawerProps> = ({
  open,
  handleClose,
  featuresRef,
  howItWorksRef,
}) => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(IsAuthenticatedSelector);

  const goToAccountLogin = () => {
    navigate("/account?tab=login");
  };
  const goToAccountRegister = () => {
    navigate("/account?tab=register");
  };
  const goToDashboard = () => {
    navigate("/app");
  };
  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Drawer open={open} onClose={handleClose}>
      <List sx={{ width: 250 }}>
        {!isAuthenticated && (
          <>
            <DrawerListItem
              label="Sign in"
              icon={<LoginIcon />}
              action={goToAccountLogin}
            />
            <DrawerListItem
              label="Sign up"
              icon={<AppRegistrationIcon />}
              action={goToAccountRegister}
            />
          </>
        )}
        {isAuthenticated && (
          <>
            <DrawerListItem
              label="Dashboard"
              icon={<DashboardIcon />}
              action={goToDashboard}
            />
            <DrawerListItem
              label="Logout"
              icon={<LogoutIcon />}
              action={handleClose}
            />
          </>
        )}
        <Divider />
        <DrawerListItem
          label="Features"
          icon={<AutoAwesomeIcon />}
          action={() => {
            scrollToSection(featuresRef);
            handleClose();
          }}
        />
        <DrawerListItem
          label="How it works"
          icon={<AutoAwesomeIcon />}
          action={() => {
            scrollToSection(howItWorksRef);
            handleClose();
          }}
        />
      </List>
    </Drawer>
  );
};

export default SideDrawer;
