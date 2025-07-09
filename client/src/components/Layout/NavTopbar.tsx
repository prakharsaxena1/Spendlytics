import React from "react";
import { capitalize } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import Brand from "../common/Brand";
import { grey } from "@mui/material/colors";
import UserMenuDropdown from "./UserMenuDropdown";
import { useLocation } from "react-router-dom";

const pathToHeading = (path: string) => {
  return path.split("/")[0].replace("-", " ");
};

const NavTopbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const location = useLocation();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
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
        <IconButton
          sx={{ "&:hover": { bgcolor: grey[400] } }}
          onClick={handleOpenMenu}
        >
          <PersonIcon />
        </IconButton>
        <UserMenuDropdown
          anchorEl={anchorEl}
          handleCloseMenu={handleCloseMenu}
        />
      </Stack>
    </Box>
  );
};

export default NavTopbar;
