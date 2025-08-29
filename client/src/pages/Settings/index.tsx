import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { AppConfigSelector } from "../../redux/slices/appConfig/selector";
import {
  changeAccentColor,
  changeFont,
  changeIconPack,
  changeTheme,
  toggleAnimations,
  type AppConfigInitialStateType,
} from "../../redux/slices/appConfig/slice";

const options = ["blue", "red", "yellow", "green"];
const fontOptions = ["sans-serif", "serif", "Roboto", "monospace"];

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const appConfig = useAppSelector(AppConfigSelector);
  const { theme, animationsEnabled, accentColor, font, iconPack } = appConfig;
  const isThemeDark = theme === "dark";
  const isIconPackRound = iconPack === "rounded";
  const themeChange = (newTheme: "light" | "dark") => {
    dispatch(changeTheme(newTheme));
  };

  const iconShapeChange = (newShape: "rounded" | "square") => {
    dispatch(changeIconPack(newShape));
  };

  return (
    <Box sx={{ flexGrow: 1, overflowX: "hidden" }}>
      <Container>
        <Stack spacing={1} sx={{ p: 2 }}>
          <Typography variant="h5" fontWeight={700} letterSpacing={2}>
            Theme & Appearance
          </Typography>
          <Divider />
          <Container sx={{ px: 4, py: 2 }}>
            <Stack direction="column" spacing={2}>
              {/* Theme */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">App theme</Typography>
                <ButtonGroup size="small">
                  <Button
                    onClick={() => themeChange("light")}
                    variant={!isThemeDark ? "contained" : "outlined"}
                  >
                    Light
                  </Button>
                  <Button
                    onClick={() => themeChange("dark")}
                    variant={isThemeDark ? "contained" : "outlined"}
                  >
                    Dark
                  </Button>
                </ButtonGroup>
              </Stack>
              {/* animations */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Animations</Typography>
                <Switch
                  checked={animationsEnabled}
                  onClick={() => dispatch(toggleAnimations(!animationsEnabled))}
                />
              </Stack>
              {/* accent color */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Accent color</Typography>
                <Autocomplete
                  sx={{ width: 200 }}
                  size="small"
                  value={accentColor}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      dispatch(changeAccentColor(newValue));
                    }
                  }}
                  options={options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Accent Color"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  )}
                  getOptionLabel={(option) =>
                    option.charAt(0).toUpperCase() + option.slice(1)
                  }
                  disableClearable
                />
              </Stack>
              {/* font */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Font</Typography>
                <Autocomplete
                  sx={{ width: 200 }}
                  size="small"
                  value={font}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      dispatch(changeFont(newValue as AppConfigInitialStateType["font"]));
                    }
                  }}
                  options={fontOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Font family"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  )}
                  getOptionLabel={(option) =>
                    option.charAt(0).toUpperCase() + option.slice(1)
                  }
                  disableClearable
                />
              </Stack>
              {/* icon pack */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Icon style</Typography>
                <ButtonGroup size="small">
                  <Button
                    onClick={() => iconShapeChange("rounded")}
                    variant={isIconPackRound ? "contained" : "outlined"}
                  >
                    Round
                  </Button>
                  <Button
                    onClick={() => iconShapeChange("square")}
                    variant={!isIconPackRound ? "contained" : "outlined"}
                  >
                    Square
                  </Button>
                </ButtonGroup>
              </Stack>
            </Stack>
          </Container>
        </Stack>
      </Container>
    </Box>
  );
};

export default Settings;
