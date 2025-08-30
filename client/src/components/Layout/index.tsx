import React, { useMemo } from "react";
import Stack from "@mui/material/Stack";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProtectedRoute from "../Auth/ProtectedRoute";
import NavTopbar from "./NavTopbar";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { getDesignTokens } from "./themes/default";
import { useAppSelector } from "../../redux/hooks";
import { AppConfigSelector } from "../../redux/slices/appConfig/selector";

const Layout: React.FC = () => {
  return (
    <ProtectedRoute>
      <Stack direction="column" sx={{ height: "100vh" }}>
        <NavTopbar />
        <Stack direction="row" flexGrow={1} sx={{ overflow: "hidden" }}>
          <Sidebar />
          <Stack flexGrow={1} sx={{ overflow: "auto" }}>
            <Outlet />
          </Stack>
        </Stack>
      </Stack>
    </ProtectedRoute>
  );
};

const ThemedLayout: React.FC = () => {
  const appConfig = useAppSelector(AppConfigSelector);
  const newTheme = useMemo(() => getDesignTokens(appConfig), [appConfig]);
  return (
    <ThemeProvider theme={newTheme}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  );
};
export default ThemedLayout;
