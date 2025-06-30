import React from "react";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  styled,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Brand from "../../components/common/Brand";
import { useAppSelector } from "../../redux/hooks";
import SideDrawer from "./SideDrawer";
import { AuthSelector } from "../../redux/slices/auth/selector";

type TopbarProps = {
  featuresRef: React.RefObject<HTMLElement | null>;
  howItWorksRef: React.RefObject<HTMLElement | null>;
};

const AccountBtn = styled(Button)({
  boxShadow: "none",
  borderRadius: 50,
  bgcolor: "#FFF",
  color: "black",
  textTransform: "none",
});

const Topbar: React.FC<TopbarProps> = ({ featuresRef, howItWorksRef }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(AuthSelector);

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };
  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  const goToDashboard = () => {
    navigate("/app/dashboard");
  };
  const goToAccountLogin = () => {
    navigate("/account?tab=login");
  };
  const goToAccountRegister = () => {
    navigate("/account?tab=register");
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        bgcolor: "#ECF0F1",
        pl: { xs: "0.5rem", sm: "1.5rem" },
        pr: { xs: "0.5rem", sm: "1.5rem" },
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: "100%",
            justifyContent: { xs: "start", md: "space-between" },
          }}
        >
          <IconButton
            color="inherit"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={handleOpenDrawer}
          >
            <MenuIcon />
          </IconButton>
          {/* Brand */}
          <Brand />
          {/* topbar menus */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button
              variant="text"
              color="inherit"
              onClick={() => scrollToSection(featuresRef)}
            >
              Features
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() => scrollToSection(howItWorksRef)}
            >
              How it works
            </Button>
          </Stack>
          {/* loggedin menus */}
          <Box sx={{ width: 200, display: { xs: "none", md: "flex" } }}>
            {isAuthenticated ? (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<DashboardIcon />}
                  onClick={goToDashboard}
                >
                  Dashboard
                </Button>
                <IconButton size="small" onClick={handleOpenDrawer}>
                  <Avatar />
                </IconButton>
              </Stack>
            ) : (
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccountBtn
                  variant="contained"
                  onClick={goToAccountLogin}
                  sx={{ color: "#FFF" }}
                >
                  Sign in
                </AccountBtn>
                <AccountBtn
                  variant="contained"
                  color="inherit"
                  onClick={goToAccountRegister}
                >
                  Sign up
                </AccountBtn>
              </Stack>
            )}
          </Box>
        </Stack>
      </Toolbar>
      <SideDrawer
        open={openDrawer}
        handleClose={handleCloseDrawer}
        featuresRef={featuresRef}
        howItWorksRef={howItWorksRef}
      />
    </Box>
  );
};

export default Topbar;
