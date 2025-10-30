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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, DialogActions, Divider } from "@mui/material";
import { IsAuthenticatedSelector } from "../../redux/slices/auth/selector";
import SlideupDialog from "../../components/common/SlideupDialog";
import { AuthApis } from "../../redux/services/auth";
import { logout } from "../../redux/slices/auth/slice";
import { changeTheme } from "../../redux/slices/appConfig/slice";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(IsAuthenticatedSelector);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const [logoutTrigger] = AuthApis.useLogoutMutation();

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

  const handleLogoutDialogOpen = () => {
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
    handleClose();
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
              action={handleLogoutDialogOpen}
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
    </Drawer>
  );
};

export default SideDrawer;
