import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#393E46",
    },
    secondary: {
      main: "#393E46",
    },
    background: {
      default: "#222831",
      paper: "#181A1B",
    },
    text: {
      primary: "#EEEEEE",
      secondary: "#00ADB5",
    },
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#393E46",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#EEEEEE",
        },
      },
    },
  },
});

export default theme;
