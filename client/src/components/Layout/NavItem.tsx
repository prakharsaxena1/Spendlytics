import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

type NavItemProps = {
  path: string;
  navName: string;
  icon: React.ReactNode;
};

const NavItem: React.FC<NavItemProps> = ({ path, icon, navName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHighlighted = location.pathname.includes(path);
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => navigate(path)}
        selected={isHighlighted}
        sx={{
          "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "white",
          },
          "&.Mui-selected:hover": {
            bgcolor: "primary.dark",
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography fontWeight={600}>{navName}</Typography>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};

export default NavItem;
