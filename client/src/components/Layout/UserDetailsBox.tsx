import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import { useAppSelector } from "../../redux/hooks";
import { capitalize } from "@mui/material";
import { CurrentUserSelector } from "../../redux/slices/auth/selector";

const UserDetailsBox: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const user = useAppSelector(CurrentUserSelector);

  if (user === null) {
    return null;
  }

  return (
    <Box sx={{ p: 1.5 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <PersonIcon
          sx={{
            fontSize: 32,
            p: 0.5,
            bgcolor: "#ECF0F1",
            borderRadius: "100%",
          }}
        />
        <Stack sx={{ visibility: isCollapsed ? 'hidden' : 'visible' }}>
          <Typography variant="body1" fontWeight={600}>
            {capitalize(user?.firstname)} {capitalize(user?.lastname)}
          </Typography>
          <Typography variant="caption" color="textSecondary" lineHeight={1}>
            Lvl {user?.level}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default UserDetailsBox;
