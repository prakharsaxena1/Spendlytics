import React, { useEffect } from "react";
import { Badge, capitalize, Divider, Drawer } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Brand from "../common/Brand";
import { grey } from "@mui/material/colors";
import UserMenuDropdown from "./UserMenuDropdown";
import { useLocation } from "react-router-dom";
import { UserApis } from "../../redux/services/user";
import InvitaionBox from "./Notifications/InvitaionBox";

const pathToHeading = (path: string) => {
  return path.split("/")[0].replace("-", " ");
};

const NavTopbar: React.FC = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);
  const [notificationTrigger, { data, isLoading }] =
    UserApis.useLazyNotificationQuery();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  useEffect(() => {
    notificationTrigger();
  }, [notificationTrigger]);

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <Box sx={{ bgcolor: grey[100], borderBottom: `1px solid ${grey[300]}` }}>
      <Stack
        px={5}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Brand />
        <Typography
          variant="h5"
          fontWeight={600}
          letterSpacing={2}
          sx={{ fontStyle: "italic" }}
        >
          {capitalize(pathToHeading(location.pathname.slice(5)))}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton loading={isLoading} onClick={handleOpenDrawer}>
            <Badge
              color="info"
              variant="dot"
              invisible={data?.invitations?.length === 0}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={handleOpenMenu}>
            <PersonIcon />
          </IconButton>
        </Stack>
        <UserMenuDropdown
          anchorEl={anchorEl}
          handleCloseMenu={handleCloseMenu}
        />
        <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
          <Box sx={{ bgcolor: "#ECF0F1", p: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <NotificationsIcon />
              <Typography variant="h5">Notifications</Typography>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ width: 450, p: 2 }}>
            {data?.invitations.map((invitation) => (
              <InvitaionBox invitationObj={invitation} />
            ))}
          </Box>
        </Drawer>
      </Stack>
    </Box>
  );
};

export default NavTopbar;
