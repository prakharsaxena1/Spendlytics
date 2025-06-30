import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

type LoginRegisterContainerProps = {
  formLabel: string;
  label: string;
  action: () => void;
  actionLabel: string;
  children: React.ReactNode;
};

const LoginRegisterContainer: React.FC<LoginRegisterContainerProps> = ({
  formLabel,
  label,
  action,
  actionLabel,
  children,
}) => {
  return (
    <Box>
      <Typography
        variant="h3"
        sx={{
          mt: 4,
          mb: 4,
          fontSize: { xs: "2.2rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        {formLabel}
      </Typography>
      {children}
      <Stack
        sx={{ p: 1, mt: 4, mb: 4 }}
        direction="row"
        spacing={0.5}
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption">{label}</Typography>
        <Button size="small" sx={{ textTransform: "none" }} onClick={action}>
          {actionLabel}
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginRegisterContainer;
