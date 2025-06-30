import { Box, Container, Divider, Slide, Stack, Switch } from "@mui/material";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";

const SubmenuContainer: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} letterSpacing={2}>
        {title}
      </Typography>
      <Divider />
      {children}
    </Stack>
  );
};

const ToggleBox: React.FC<{
  toggleName: string;
  toggleAction: (val: boolean) => void;
}> = ({ toggleName, toggleAction }) => {
  const [checked, setChecked] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    toggleAction(event.target.checked);
  };
  return (
    <Stack direction="row" justifyContent="center">
      <Stack direction="row" alignItems="center" justifyContent="space-between" width="50%">
        <Typography variant="body1">{toggleName}</Typography>
        <Switch checked={checked} onChange={handleChange} />
      </Stack>
    </Stack>
  );
};

const Settings: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, overflowX: "hidden" }}>
      <Slide direction="right" timeout={600} in>
        <Box sx={{ p: 1.4 }}>
          <Typography variant="h4" fontWeight={700} letterSpacing={2}>
            Settings
          </Typography>
        </Box>
      </Slide>
      <Divider />
      <Container sx={{ mt: 2, mb: 2 }}>
        <SubmenuContainer title="Theme & Appearance">
          <ToggleBox
            toggleName="Use dark theme"
            toggleAction={(chk) => console.log({ chk })}
          />
        </SubmenuContainer>
      </Container>
    </Box>
  );
};

export default Settings;
