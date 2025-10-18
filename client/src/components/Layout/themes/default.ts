import { createTheme } from "@mui/material/styles";

const colorMap: Record<string, Record<string, string>> = {
  blue: {
    light: "#42a5f5",
    main: "#1976d2",
    dark: "#1565c0",
    contrastText: "#fff",
  },
  red: {
    light: "#ef5350",
    main: "#d32f2f",
    dark: "#c62828",
    contrastText: "#fff",
  },
  yellow: {
    light: "#ffeb3b",
    main: "#ffc107",
    dark: "#ff8f00",
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  green: {
    light: "#66bb6a",
    main: "#2e7d32",
    dark: "#1b5e20",
    contrastText: "#fff",
  },
};

// Font mappings
const fontMap: Record<string, string> = {
  Roboto: '"Roboto", "Helvetica", "Arial", sans-serif',
  "sans-serif": '"Inter", "Arial", sans-serif',
  serif: '"Georgia", "Times New Roman", serif',
  monospace: '"Roboto Mono", "Courier New", monospace',
};

export const getDesignTokens = (config: {
  theme: string;
  fontFamily: string;
  accentColor: string;
  animationsEnabled: boolean;
  iconPack: string;
}) => {
  const isDark = config.theme === "dark";
  const primaryColor = colorMap[config.accentColor] || colorMap.blue;

  return createTheme({
    palette: {
      mode: config.theme as 'light' | 'dark',
      primary: primaryColor,
      background: {
        default: isDark ? "#121212" : "#f8f9fa",
        paper: isDark ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: isDark ? "#ffffff" : "#1a1a1a",
        secondary: isDark ? "rgba(255, 255, 255, 0.7)" : "#666666",
      },
      divider: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    },
    typography: {
      fontFamily: fontMap[config.fontFamily] || fontMap["sans-serif"],
      h1: {
        fontSize: "2.5rem",
        fontWeight: 600,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: config.iconPack === "rounded" ? 8 : 0,
    },
    spacing: 8,
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
            color: isDark ? "#ffffff" : "#1a1a1a",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: config.iconPack === "rounded" ? 20 : 2,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: config.animationsEnabled ? "all 0.3s ease" : "none",
            "&:hover": {
              transform: config.animationsEnabled ? "translateY(-4px)" : "none",
              boxShadow: config.animationsEnabled
                ? "0 8px 16px rgba(0,0,0,0.1)"
                : "0 2px 8px rgba(0,0,0,0.1)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: isDark ? { backgroundImage: "none" } : {},
        },
      },
    },
  });
};
